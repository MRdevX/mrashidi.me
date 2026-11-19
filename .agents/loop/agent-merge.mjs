#!/usr/bin/env node
// The merge half of the agent ticket loop. The orchestrator in the mr-ticket-loop skill
// decides which ticket is worked on (ranked by agent-loop.mjs); this decides whether the PR
// that came out of it may land without a human.
//
//   status <pr>  -> the verdict for one PR, reads only
//   merge  <pr>  -> poll until the checks settle, then squash-merge, or exit non-zero
//   main-health  -> was the last run of `mainWorkflow` (docs/agent/ticket-loop.json, else any
//                   workflow) on main green (the next pass's precondition)
//
// Why the checks are polled here instead of `gh pr merge --auto`: GitHub auto-merge needs
// `allow_auto_merge` plus at least one required status check, and branch protection is not
// available on every plan. With nothing required, GitHub reports a PR whose
// Verify run failed as perfectly mergeable, so the green/red call cannot be delegated to it
// and has to be made from the check runs themselves.
//
// Why a script rather than the agent's judgement, same reasoning as agent-loop.mjs: the
// merge is the one step of the loop that the loop cannot undo, so it is an exit code rather
// than a model reading a screenful of CI output and deciding it looks fine.
//
// Some projects run no workflow on a PR at all (masir dispatches them on demand), so a PR
// with no Actions check is green rather than pending -- but only once the grace window
// has passed, because "no checks reported" is also what GitHub says in the seconds between
// the push and a dispatched run being queued. Merging inside that window merges before it starts.
//
// No pnpm install, no dependencies beyond the `gh` CLI, so a cloud routine costs a checkout
// and nothing else.
//
// Exit codes: 0 done, 1 error, 4 checks red, 5 timed out, 6 blocked, 7 main is red.

import { execFileSync } from 'node:child_process';
import { loopConfig } from './lib/config.mjs';

const EXIT = { ok: 0, error: 1, red: 4, timeout: 5, blocked: 6, mainRed: 7 };

const DEFAULT_TIMEOUT_MINS = 25;
const DEFAULT_POLL_SECS = 20;
const DEFAULT_GRACE_SECS = 120;

const MERGE_METHOD = '--squash';

function arg(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? fallback : process.argv[index + 1];
}

function num(name, fallback) {
  const raw = arg(name);
  if (raw === undefined) return fallback;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) fail(`--${name} must be a non-negative number.`);
  return value;
}

function out(payload) {
  console.log(JSON.stringify(payload, null, 2));
}

function fail(message, code = EXIT.error) {
  out({ ok: false, error: message });
  process.exit(code);
}

function stop(payload, code) {
  out(payload);
  process.exit(code);
}

/** `gh pr checks` exits non-zero for red and for pending alike, so the status is data here. */
function gh(args) {
  try {
    return { status: 0, stdout: execFileSync('gh', args, { encoding: 'utf8' }) };
  } catch (error) {
    if (error.code === 'ENOENT') {
      fail('The `gh` CLI is not installed. https://cli.github.com');
    }
    return {
      status: error.status ?? 1,
      stdout: error.stdout ?? '',
      stderr: error.stderr ?? String(error.message ?? ''),
    };
  }
}

function ghJson(args, what) {
  const result = gh(args);
  if (!result.stdout.trim()) {
    fail(`gh returned nothing while reading ${what}: ${result.stderr?.trim() || 'no output'}`);
  }
  try {
    return JSON.parse(result.stdout);
  } catch {
    fail(`gh returned unparseable JSON while reading ${what}.`);
  }
}

const sleep = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));

const PR_FIELDS = [
  'number',
  'url',
  'title',
  'state',
  'isDraft',
  'mergeable',
  'mergeStateStatus',
  'reviewDecision',
  'headRefName',
  'headRefOid',
].join(',');

function readPr(pr) {
  return ghJson(['pr', 'view', pr, '--json', PR_FIELDS], `pull request ${pr}`);
}

/**
 * Everything that makes a PR unmergeable regardless of CI. `mergeStateStatus` is deliberately
 * not consulted for the green decision: with no required checks it reports UNSTABLE, which
 * GitHub is happy to merge, for exactly the failing Verify run this script exists to catch.
 */
function blockedReason(pr) {
  if (pr.state === 'MERGED') return 'already merged';
  if (pr.state === 'CLOSED') return 'closed without merging';
  if (pr.isDraft) return 'still a draft';
  if (pr.mergeable === 'CONFLICTING') return 'conflicts with main';
  if (pr.reviewDecision === 'CHANGES_REQUESTED') return 'a reviewer requested changes';
  return null;
}

function readChecks(pr) {
  const result = gh(['pr', 'checks', pr, '--json', 'name,state,bucket,link,workflow']);
  const text = result.stdout.trim();
  // Path-filtered workflows never report, and neither does a run that has not been queued
  // yet. Both arrive here as this one message.
  if (!text) {
    if (/no checks reported/i.test(result.stderr ?? '')) return [];
    fail(`Could not read checks for ${pr}: ${result.stderr?.trim() || 'no output'}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    fail(`Could not parse the check list for ${pr}.`);
  }
}

/**
 * Only GitHub Actions check runs carry a workflow name. Third-party apps installed on the
 * repo report with an empty one, and at least one of those (`[code]smith`) attaches to every
 * PR within seconds of it opening. It is not a gate and must never be mistaken for one:
 * counting it as "a check has arrived" is what would let a PR look green before Verify has
 * been queued.
 */
const isActionsCheck = (check) => Boolean(check.workflow);

/**
 * A cancelled run counts as red. verify.yml cancels in-progress runs of the same ref, so a
 * cancellation means either a superseded push or a runner that went away, and neither is
 * evidence that the branch is good.
 */
function verdict(checks) {
  const bucket = (name) => checks.filter((check) => check.bucket === name);
  const failing = [...bucket('fail'), ...bucket('cancel')];
  const pending = bucket('pending');

  if (failing.length > 0) return { state: 'red', failing, pending };
  if (pending.length > 0) return { state: 'pending', failing, pending };
  return { state: 'green', failing, pending };
}

function describe(checks) {
  return checks.map((check) => ({
    name: check.name,
    workflow: check.workflow ?? null,
    bucket: check.bucket,
    link: check.link ?? null,
  }));
}

async function settle(pr, { timeoutMins, pollSecs, graceSecs, onTick }) {
  const deadline = Date.now() + timeoutMins * 60_000;
  const graceUntil = Date.now() + graceSecs * 1000;

  for (;;) {
    const detail = readPr(pr);
    const blocked = blockedReason(detail);
    if (blocked) return { outcome: 'blocked', reason: blocked, detail, checks: [] };

    const checks = readChecks(pr);
    const { state, failing, pending } = verdict(checks);

    if (state === 'red') return { outcome: 'red', detail, checks, failing };

    // Green with an Actions run on it is green now. Green with nothing but third-party checks
    // means either a PR no dispatched workflow gates, or a run that has not been queued yet,
    // and those two are indistinguishable until the grace window closes.
    const gated = checks.some(isActionsCheck);
    const settled = state === 'green' && (gated || Date.now() >= graceUntil);
    if (settled) return { outcome: 'green', detail, checks, gated };

    if (Date.now() >= deadline) {
      return { outcome: 'timeout', detail, checks, pending };
    }

    onTick?.({ state, checks, pending });
    await sleep(pollSecs);
  }
}

async function cmdStatus(pr) {
  if (!pr) fail('status needs a PR number or URL.');

  const detail = readPr(pr);
  const blocked = blockedReason(detail);
  const checks = readChecks(pr);
  const { state } = verdict(checks);

  out({
    ok: true,
    action: 'status',
    pr: detail.url,
    title: detail.title,
    branch: detail.headRefName,
    prState: detail.state,
    blocked,
    checkState: blocked ? 'n/a' : state,
    gated: checks.some(isActionsCheck),
    behind: detail.mergeStateStatus === 'BEHIND',
    checks: describe(checks),
  });
}

async function cmdMerge(pr) {
  if (!pr) fail('merge needs a PR number or URL.');

  const timeoutMins = num('timeout-mins', DEFAULT_TIMEOUT_MINS);
  const pollSecs = num('poll-secs', DEFAULT_POLL_SECS);
  const graceSecs = num('grace-secs', DEFAULT_GRACE_SECS);

  const onTick = ({ state, pending }) => {
    const names = pending.map((check) => check.name).join(', ');
    console.error(`waiting: ${state}${names ? ` (${names})` : ' (no workflow run yet)'}`);
  };

  let result = await settle(pr, { timeoutMins, pollSecs, graceSecs, onTick });

  // One catch-up merge of main into the branch, no more. CI proved the branch green against
  // an older base, and a second pass would mean another loop is merging faster than this one
  // can land, which is a situation for a human rather than a retry.
  if (result.outcome === 'green' && result.detail.mergeStateStatus === 'BEHIND') {
    console.error('branch is behind main, updating it and re-checking');
    const updated = gh(['pr', 'update-branch', pr]);
    if (updated.status !== 0) {
      stop(
        {
          ok: false,
          action: 'merge',
          pr,
          outcome: 'blocked',
          reason: `behind main and the branch update failed: ${updated.stderr?.trim()}`,
        },
        EXIT.blocked,
      );
    }
    await sleep(pollSecs);
    result = await settle(pr, { timeoutMins, pollSecs, graceSecs, onTick });
  }

  const base = { action: 'merge', pr: result.detail?.url ?? pr, checks: describe(result.checks) };

  if (result.outcome === 'blocked') {
    stop({ ok: false, ...base, outcome: 'blocked', reason: result.reason }, EXIT.blocked);
  }
  if (result.outcome === 'red') {
    stop(
      {
        ok: false,
        ...base,
        outcome: 'red',
        failing: describe(result.failing),
        reason: 'CI is red on this PR.',
      },
      EXIT.red,
    );
  }
  if (result.outcome === 'timeout') {
    stop(
      {
        ok: false,
        ...base,
        outcome: 'timeout',
        pending: describe(result.pending),
        reason: `Checks did not settle within ${timeoutMins} minutes.`,
      },
      EXIT.timeout,
    );
  }

  const merged = gh(['pr', 'merge', pr, MERGE_METHOD, '--delete-branch']);
  if (merged.status !== 0) {
    fail(`Checks were green but the merge failed: ${merged.stderr?.trim() || 'unknown error'}`);
  }

  const after = readPr(pr);
  out({
    ok: true,
    ...base,
    outcome: 'merged',
    title: after.title,
    sha: after.headRefOid,
    // False means no workflow gates this diff, only the path filters. Worth seeing in the
    // run log, because it is also what a misconfigured path filter looks like.
    gated: Boolean(result.gated),
  });
}

/**
 * Read at the start of a pass rather than waited on at the end of one. The staging deploy
 * takes minutes, and blocking the loop on it would halve the throughput that auto-merge is
 * for. Catching a broken main one pass late is enough, because the cost being avoided is
 * branching a new ticket off it, not the breakage itself.
 */
async function cmdMainHealth() {
  const { mainWorkflow } = loopConfig();
  const runs = ghJson(
    [
      'run',
      'list',
      ...(mainWorkflow ? ['--workflow', mainWorkflow] : []),
      '--branch',
      'main',
      '--limit',
      '1',
      '--json',
      'status,conclusion,headSha,url,createdAt',
    ],
    'the last Main run',
  );

  const [run] = runs;
  if (!run) {
    return out({ ok: true, action: 'main-health', state: 'none', message: 'No Main run yet.' });
  }

  if (run.status !== 'completed') {
    return out({ ok: true, action: 'main-health', state: 'running', run: run.url });
  }

  // `cancelled` on main is a human stopping a deploy; it counts as red.
  const healthy = run.conclusion === 'success';
  const payload = {
    ok: healthy,
    action: 'main-health',
    state: healthy ? 'green' : 'red',
    conclusion: run.conclusion,
    sha: run.headSha,
    run: run.url,
  };

  if (!healthy) {
    payload.error = 'The last Main run failed. Stop the loop and fix main before shipping more.';
    stop(payload, EXIT.mainRed);
  }
  out(payload);
}

async function main() {
  const [command, positional] = process.argv.slice(2);

  if (!command || command === 'help') {
    console.log(
      [
        'Usage:',
        '  agent-merge.mjs status <pr>',
        '  agent-merge.mjs merge  <pr> [--timeout-mins 25] [--poll-secs 20] [--grace-secs 120]',
        '  agent-merge.mjs main-health',
      ].join('\n'),
    );
    process.exit(command ? EXIT.ok : EXIT.error);
  }

  switch (command) {
    case 'status':
      return cmdStatus(positional);
    case 'merge':
      return cmdMerge(positional);
    case 'main-health':
      return cmdMainHealth();
    default:
      fail(`Unknown command "${command}". Try: status, merge, main-health.`);
  }
}

main().catch((error) => fail(error.message));
