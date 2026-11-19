#!/usr/bin/env node
// The deterministic half of the ticket loop: what must be an exit code, not a model's call.
// The tracker is read and written by the orchestrator (linear.mjs, github.mjs or an MCP), never
// here. Ids are `<TEAM>-nn` for Linear and `#nn` for GitHub, per docs/agent/ticket-loop.json.
//
//   rank                                 <- graph JSON on stdin -> claimable, waiting, stale, merged
//   on-main <id>...                      -> is each issue's code on origin/main (exit 2 if any is not)
//   epic open|status <branch>            -> the run's epic branch and worktree, merged ids, unpushed merges
//   epic merge <id> <subject> --into <branch>
//                                        -> land the ticket branch in the epic branch, drop its worktree
//   epic close <branch>                  -> drop the pushed epic's worktree and local branch
//   worktree add <id> <branch> [--base <ref>]
//   worktree remove <id> | worktree sweep   (sweep also closes clean, pushed epics)
//
// A ticket's code is found by the merge subject `<subject> (<id>)` the loop writes, in the
// epic branch or, once the epic PR lands, on origin/main. A squash-merged PR keeps only
// `Fixes <id>` in its body, so `gh` is the last resort, and a missing `gh` means "not on main"
// rather than an error.
//
// Exit codes: 0 ok, 1 error, 2 not on main / nothing claimable, 3 epic moved under the ticket.

import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { checkoutRoot, loopConfig, mainRoot } from './lib/config.mjs';
import { closingKeysIn, mergedKeysIn } from './lib/issue-refs.mjs';

const EXIT = { ok: 0, error: 1, no: 2, moved: 3 };
const STALE_CLAIM_HOURS = 6;
const PRIORITY_NONE_LAST = 5;
const GIT_MAX_BUFFER = 64 * 1024 * 1024;

let config;
try {
  config = loopConfig();
} catch (error) {
  console.log(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exit(1);
}
const { states, id: ids, readyLabel } = config;
const ON_MAIN = new Set(states.shipped);
const REVIEWED = new Set([states.inReview, ...states.shipped]);
const DROPPED = new Set(states.dropped);
const WORKABLE = [states.backlog, states.todo, states.blocked];

const main = mainRoot();
// Nested in the checkout that runs the loop, not in main: the Claude desktop app lets a
// session and its subagents write only inside that session's own worktree.
const worktrees = join(checkoutRoot, '.claude', 'worktrees');

function out(payload) {
  console.log(JSON.stringify(payload, null, 2));
}

function fail(message, code = EXIT.error) {
  out({ ok: false, error: message });
  process.exit(code);
}

function git(args, cwd = main) {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    maxBuffer: GIT_MAX_BUFFER,
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function gitOk(args, cwd = main) {
  return spawnSync('git', args, { cwd, stdio: 'ignore' }).status === 0;
}

function hasRef(ref) {
  return gitOk(['rev-parse', '--verify', '--quiet', ref]);
}

function flag(args, name) {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? undefined : args[index + 1];
}

function issueNumber(id) {
  if (!ids.exact.test(id)) fail(`Not an issue id for this project: ${id} (expected like ${ids.example})`);
  return ids.number(id);
}

function mergedKeysInLog(range) {
  return new Set(mergedKeysIn(git(['log', '--format=%B', range]), ids.source));
}

function mergedOnMain() {
  return hasRef('origin/main') ? mergedKeysInLog('origin/main') : new Set();
}

function mergedOnBranch(ref) {
  return hasRef(ref) ? mergedKeysInLog(`origin/main..${ref}`) : new Set();
}

function mergedPrOnMain(id) {
  const result = spawnSync(
    'gh',
    [
      'pr',
      'list',
      '--state',
      'merged',
      '--search',
      `${id} in:body`,
      '--limit',
      '20',
      '--json',
      'url,body,mergeCommit',
    ],
    { encoding: 'utf8' },
  );
  if (result.status !== 0) return null;
  const pr = JSON.parse(result.stdout).find((p) => closingKeysIn(p.body, ids.source).includes(id));
  const sha = pr?.mergeCommit?.oid;
  return sha && gitOk(['merge-base', '--is-ancestor', sha, 'origin/main']) ? pr.url : null;
}

function onMainCheck(onMain) {
  return (id) => {
    if (onMain.has(id)) return { id, onMain: true, via: 'origin/main' };
    const pr = mergedPrOnMain(id);
    return pr ? { id, onMain: true, via: pr } : { id, onMain: false, via: null };
  };
}

function worktreePath(id) {
  return join(worktrees, ids.dirName(id));
}

function epicPath(branch) {
  return join(worktrees, `epic-${branch.replaceAll('/', '-')}`);
}

function hoursSince(iso) {
  return (Date.now() - new Date(iso).getTime()) / 3_600_000;
}

function priorityRank(priority) {
  return priority === 0 || priority == null ? PRIORITY_NONE_LAST : priority;
}

function readGraph() {
  let raw = '';
  try {
    raw = execFileSync('cat', [], { encoding: 'utf8', stdio: ['inherit', 'pipe', 'inherit'] });
  } catch {
    fail('rank reads the graph as JSON on stdin.');
  }
  try {
    return JSON.parse(raw);
  } catch {
    fail('rank could not parse the JSON on stdin.');
  }
}

function rank() {
  const graph = readGraph();
  const mode = graph.mode === 'workspace' ? 'workspace' : 'project';
  const order = new Map((graph.order ?? []).map((id, index) => [id, index]));
  const issues = graph.issues ?? [];
  const byId = new Map(issues.map((issue) => [issue.id, issue]));
  const inEpic = graph.epicBranch ? mergedOnBranch(graph.epicBranch) : new Set();
  const checkMain = onMainCheck(mergedOnMain());
  const mainCache = new Map();

  const resolved = (blockerId) => {
    const status = byId.get(blockerId)?.status;
    if (DROPPED.has(status) || ON_MAIN.has(status))
      return { ok: true, why: `${blockerId} ${status}` };
    if (inEpic.has(blockerId)) return { ok: true, why: `${blockerId} in ${graph.epicBranch}` };
    if (!mainCache.has(blockerId)) mainCache.set(blockerId, checkMain(blockerId));
    const check = mainCache.get(blockerId);
    return check.onMain
      ? { ok: true, why: `${blockerId} on main (${check.via})` }
      : { ok: false, why: `${blockerId} not merged` };
  };

  const claimable = [];
  const waiting = [];
  const stale = [];
  const merged = [];
  const epics = [];

  for (const issue of issues) {
    if (issue.hasChildren) {
      epics.push(issue.id);
      continue;
    }
    if (REVIEWED.has(issue.status) || DROPPED.has(issue.status)) continue;
    if (inEpic.has(issue.id)) {
      merged.push({ id: issue.id, status: issue.status });
      continue;
    }

    if (issue.status === states.inProgress) {
      const mine = graph.me && issue.assignee === graph.me;
      const idle = issue.startedAt ? hoursSince(issue.startedAt) > STALE_CLAIM_HOURS : false;
      const traces =
        existsSync(worktreePath(issue.id)) ||
        (issue.branch &&
          (hasRef(`refs/heads/${issue.branch}`) || hasRef(`origin/${issue.branch}`)));
      if (mine && idle && !traces) {
        stale.push({
          id: issue.id,
          reason: `claimed ${Math.round(hoursSince(issue.startedAt))}h ago, no branch, no worktree`,
        });
      } else {
        waiting.push({ id: issue.id, reason: 'in progress' });
      }
      continue;
    }

    const labelled = (issue.labels ?? []).includes(readyLabel);
    const parkedByLoop = issue.status === states.blocked && issue.lastCommentByLoop === true;

    if (mode === 'workspace') {
      if (issue.status !== states.todo || !labelled || issue.assignee) {
        waiting.push({
          id: issue.id,
          reason: `${issue.status}${labelled ? '' : `, not ${readyLabel}`}${issue.assignee ? ', assigned' : ''}`,
        });
        continue;
      }
    } else if (issue.status === states.blocked && !parkedByLoop) {
      waiting.push({ id: issue.id, reason: 'blocked by a person' });
      continue;
    } else if (!WORKABLE.includes(issue.status) || issue.assignee) {
      waiting.push({
        id: issue.id,
        reason: `${issue.status}${issue.assignee ? ', assigned' : ''}`,
      });
      continue;
    }

    const blockers = (issue.blockedBy ?? []).map(resolved);
    const unresolved = blockers.filter((b) => !b.ok);
    if (unresolved.length > 0) {
      waiting.push({ id: issue.id, reason: unresolved.map((b) => b.why).join('; ') });
      continue;
    }

    claimable.push({
      id: issue.id,
      title: issue.title,
      status: issue.status,
      branch: issue.branch ?? null,
      parked: parkedByLoop,
      priority: issue.priority ?? 0,
      blockers: blockers.map((b) => b.why),
    });
  }

  claimable.sort(
    (a, b) =>
      priorityRank(a.priority) - priorityRank(b.priority) ||
      (order.get(a.id) ?? Number.POSITIVE_INFINITY) -
        (order.get(b.id) ?? Number.POSITIVE_INFINITY) ||
      issueNumber(a.id) - issueNumber(b.id),
  );

  out({ ok: true, mode, claimable, waiting, stale, merged, epics });
  process.exit(claimable.length > 0 ? EXIT.ok : EXIT.no);
}

function fetch(...refs) {
  for (const ref of refs) spawnSync('git', ['fetch', '--quiet', 'origin', ref], { cwd: main });
}

function bootstrap(path) {
  if (!config.bootstrap) return { ready: true, output: '' };
  const result = spawnSync(config.bootstrap, { cwd: path, encoding: 'utf8', shell: true });
  return { ready: result.status === 0, output: `${result.stdout ?? ''}${result.stderr ?? ''}`.trim() };
}

function epicState(branch) {
  const path = epicPath(branch);
  const remote = hasRef(`origin/${branch}`);
  const local = hasRef(`refs/heads/${branch}`);
  const pushedBase = remote ? `origin/${branch}` : 'origin/main';
  const onMain = mergedOnMain();
  return {
    path,
    branch,
    worktree: existsSync(path),
    local,
    remote,
    merged: local ? [...mergedOnBranch(branch)].filter((id) => !onMain.has(id)) : [],
    unpushed: local ? Number(git(['rev-list', '--count', `${pushedBase}..${branch}`])) : 0,
    behindMain: local ? Number(git(['rev-list', '--count', `${branch}..origin/main`])) : 0,
  };
}

function epicOpen(branch) {
  fetch('main', branch);
  const path = epicPath(branch);
  const remote = hasRef(`origin/${branch}`);
  let created = false;

  if (!hasRef(`refs/heads/${branch}`)) {
    git(['branch', '--no-track', branch, remote ? `origin/${branch}` : 'origin/main']);
    created = true;
  } else if (remote && !gitOk(['merge-base', '--is-ancestor', `origin/${branch}`, branch])) {
    if (!gitOk(['merge-base', '--is-ancestor', branch, `origin/${branch}`]))
      fail(`${branch} and origin/${branch} have diverged; reconcile them by hand.`);
    if (existsSync(path)) git(['merge', '--ff-only', `origin/${branch}`], path);
    else git(['branch', '-f', branch, `origin/${branch}`]);
  }

  let boot = { ready: true, output: '' };
  if (!existsSync(path)) {
    git(['worktree', 'add', path, branch]);
    boot = bootstrap(path);
  } else if (git(['rev-parse', '--abbrev-ref', 'HEAD'], path) !== branch) {
    fail(`${path} is not on ${branch}; remove it first.`);
  }

  out({ ok: boot.ready, created, ...epicState(branch), bootstrap: boot.output });
  process.exit(boot.ready ? EXIT.ok : EXIT.error);
}

function epicMerge(id, subject, branch) {
  if (!subject || !branch) fail(`epic merge needs: epic merge ${ids.example} "<subject>" --into <branch>`);
  const epic = epicPath(branch);
  const ticket = worktreePath(id);
  if (!existsSync(epic)) fail(`No epic worktree at ${epic}; run epic open ${branch} first.`);
  if (!existsSync(ticket)) fail(`No ticket worktree at ${ticket}.`);
  if (git(['status', '--porcelain'], ticket)) fail(`${ticket} has uncommitted changes.`);

  const ticketBranch = git(['rev-parse', '--abbrev-ref', 'HEAD'], ticket);
  const tip = git(['rev-parse', 'HEAD'], epic);
  if (git(['merge-base', tip, ticketBranch]) !== tip)
    fail(
      `${ticketBranch} is not based on the tip of ${branch}; rebase it onto ${branch}.`,
      EXIT.moved,
    );
  if (git(['rev-list', '--count', `${tip}..${ticketBranch}`]) === '0')
    fail(`${ticketBranch} has no commits beyond ${branch}.`);

  git(['merge', '--no-ff', ticketBranch, '-m', `${subject} (${id})`], epic);
  git(['worktree', 'remove', '--force', ticket]);
  git(['branch', '-D', ticketBranch]);
  out({ ok: true, id, branch, sha: git(['rev-parse', '--short', 'HEAD'], epic), ticketBranch });
}

function worktreeAdd(id, branch, base = 'origin/main') {
  if (!branch) fail(`worktree add needs the issue's branch name: worktree add ${ids.example} <branch>`);
  const path = worktreePath(id);
  if (existsSync(path)) fail(`${path} already exists; remove it first (worktree remove ${id}).`);
  fetch('main');
  const reused = hasRef(`refs/heads/${branch}`);
  git(reused ? ['worktree', 'add', path, branch] : ['worktree', 'add', path, '-b', branch, base]);
  const boot = bootstrap(path);
  out({ ok: boot.ready, path, branch, base, reused, bootstrap: boot.output });
  process.exit(boot.ready ? EXIT.ok : EXIT.error);
}

function branchAt(path) {
  return git(['rev-parse', '--abbrev-ref', 'HEAD'], path);
}

function isPushed(path, branch) {
  return (
    hasRef(`origin/${branch}`) &&
    git(['rev-list', '--count', `origin/${branch}..HEAD`], path) === '0'
  );
}

function isClean(path) {
  return git(['status', '--porcelain'], path) === '';
}

function removeWorktree(path) {
  const branch = branchAt(path);
  const unpushed = !isPushed(path, branch);
  git(['worktree', 'remove', '--force', path]);
  const branchDeleted = !unpushed && branch !== 'main';
  if (branchDeleted) git(['branch', '-D', branch]);
  return { removed: true, branch, branchDeleted, unpushed };
}

function worktreeRemove(id) {
  const path = worktreePath(id);
  return existsSync(path) ? { id, ...removeWorktree(path) } : { id, removed: false };
}

function epicClose(branch) {
  fetch(branch);
  const path = epicPath(branch);
  if (!existsSync(path)) return { branch, removed: false };
  if (!isClean(path)) fail(`${path} has uncommitted changes.`);
  if (!isPushed(path, branch)) fail(`${branch} has commits not on origin/${branch}; push first.`);
  return removeWorktree(path);
}

function worktreeSweep() {
  const names = existsSync(worktrees) ? readdirSync(worktrees) : [];
  const removed = names
    .filter(ids.isDirName)
    .map((name) => name.replace(/^gh-/, '#'))
    .map(worktreeRemove);
  const closedEpics = names
    .filter((name) => name.startsWith('epic-'))
    .map((name) => join(worktrees, name))
    .filter((path) => isClean(path) && isPushed(path, branchAt(path)))
    .map(removeWorktree);
  out({ ok: true, removed, closedEpics });
}

const [command, ...rest] = process.argv.slice(2);

switch (command) {
  case 'rank':
    rank();
    break;
  case 'on-main': {
    if (rest.length === 0) fail('on-main needs at least one issue id.');
    rest.forEach(issueNumber);
    fetch('main');
    const results = rest.map(onMainCheck(mergedOnMain()));
    out({ ok: true, results });
    process.exit(results.every((r) => r.onMain) ? EXIT.ok : EXIT.no);
    break;
  }
  case 'epic': {
    const [action, first, second] = rest;
    if (action === 'open' && first) epicOpen(first);
    else if (action === 'status' && first) {
      fetch('main', first);
      out({ ok: true, ...epicState(first) });
    } else if (action === 'merge' && first) {
      issueNumber(first);
      epicMerge(first, second, flag(rest, 'into'));
    } else if (action === 'close' && first) out({ ok: true, ...epicClose(first) });
    else
      fail(
        'Usage: epic open|status|close <branch> | epic merge <id> "<subject>" --into <branch>',
      );
    break;
  }
  case 'worktree': {
    const [action, id, branch] = rest;
    if (action === 'sweep') worktreeSweep();
    else if (action === 'add' && id) {
      issueNumber(id);
      worktreeAdd(id, branch, flag(rest, 'base'));
    } else if (action === 'remove' && id) {
      issueNumber(id);
      out({ ok: true, ...worktreeRemove(id) });
    } else
      fail(
        'Usage: worktree add <id> <branch> [--base <ref>] | worktree remove <id> | worktree sweep',
      );
    break;
  }
  default:
    fail(
      'Usage: agent-loop.mjs rank | on-main <id>... | epic open|status|merge|close … | worktree add|remove|sweep …',
    );
}
