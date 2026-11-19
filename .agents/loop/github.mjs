#!/usr/bin/env node
// GitHub issues for the ticket loop and ticket refine, with the same commands and JSON as
// linear.mjs. Uses REST through `gh api` only: cloud sessions block GraphQL (`gh issue`, `gh pr`).
// GitHub has no workflow states, so a state is a label (see STATE_LABELS); an issue with none of
// them is `todo`, and closed issues are the first `shipped` or `dropped` state.
//
//   whoami                                   -> the gh user; exit 3 when gh is not signed in
//   graph <#epic> [--order #a,#b]            -> rank input for `agent-loop.mjs rank`
//   queue                                    -> rank input for workspace mode
//   issue <#n>                               -> description, relations, latest comment
//   update <#n> [--state S] [--assignee me|none] [--title T]
//          [--add-label L]... [--remove-label L]... [--blocked-by #x]...
//          [--description-file F | --patch-file F]
//   comment <#n> --body-file F
//   create --title T --description-file F [--parent #n] [--state S] [--label L]... [--blocked-by #x]...
//
// Exit codes: 0 ok, 1 error, 3 gh not signed in.

import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { checkoutRoot, loopConfig } from './lib/config.mjs';
import { applyPatch, PatchError } from './lib/description-patch.mjs';

const EXIT = { ok: 0, error: 1, noAuth: 3 };
const LOOP_PARK_MARKER = 'Parked by the ticket loop';

function out(payload) {
  console.log(JSON.stringify(payload, null, 2));
}

function fail(message, code = EXIT.error) {
  out({ ok: false, error: message });
  process.exit(code);
}

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) {
      positional.push(argv[i]);
      continue;
    }
    const name = argv[i].slice(2);
    const value = argv[i + 1];
    if (value === undefined || value.startsWith('--')) fail(`--${name} needs a value`);
    flags[name] = [...(flags[name] ?? []), value];
    i++;
  }
  return { positional, one: (name) => flags[name]?.at(-1), many: (name) => flags[name] ?? [] };
}

let config;
try {
  config = loopConfig();
} catch (error) {
  fail(error.message);
}
const { states, readyLabel } = config;

const STATE_LABELS = {
  [states.backlog]: 'backlog',
  [states.inProgress]: 'in-progress',
  [states.inReview]: 'in-review',
  [states.blocked]: 'blocked',
};
const LABEL_STATES = Object.fromEntries(Object.entries(STATE_LABELS).map(([s, l]) => [l, s]));

function api(method, path, body) {
  const args = ['api', '-X', method, path, '-H', 'Accept: application/vnd.github+json'];
  if (body !== undefined) args.push('--input', '-');
  const result = spawnSync('gh', args, {
    input: body === undefined ? undefined : JSON.stringify(body),
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  if (result.status !== 0) fail(`gh api ${method} ${path}: ${(result.stderr || result.stdout).trim()}`);
  return result.stdout.trim() ? JSON.parse(result.stdout) : null;
}

function list(path) {
  const separator = path.includes('?') ? '&' : '?';
  const raw = execFileSync('gh', ['api', '--paginate', '--slurp', `${path}${separator}per_page=100`], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  return JSON.parse(raw).flat();
}

const repo = (() => {
  const url = execFileSync('git', ['remote', 'get-url', 'origin'], {
    cwd: checkoutRoot,
    encoding: 'utf8',
  }).trim();
  const match = /github\.com[:/]([^/]+\/[^/]+?)(?:\.git)?$/.exec(url);
  if (!match) fail(`origin is not a GitHub repository: ${url}`);
  return `repos/${match[1]}`;
})();

function number(id) {
  if (!config.id.exact.test(id ?? '')) fail(`Not a GitHub issue id: ${id} (expected like #12)`);
  return config.id.number(id);
}

function statusOf(issue) {
  if (issue.state === 'closed') {
    return issue.state_reason === 'completed' ? states.shipped[0] : states.dropped[0];
  }
  const label = issue.labels.map((l) => l.name).find((name) => LABEL_STATES[name]);
  return label ? LABEL_STATES[label] : states.todo;
}

function slug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50)
    .replace(/-$/, '');
}

function branchFor(issue) {
  return `feature/${issue.number}-${slug(issue.title)}`;
}

function blockersOf(n) {
  return list(`${repo}/issues/${n}/dependencies/blocked_by`).map((issue) => `#${issue.number}`);
}

function latestComment(n) {
  return list(`${repo}/issues/${n}/comments`).at(-1) ?? null;
}

function me() {
  return api('GET', 'user').login;
}

function rankNode(issue) {
  const status = statusOf(issue);
  return {
    id: `#${issue.number}`,
    title: issue.title,
    status,
    labels: issue.labels.map((l) => l.name),
    priority: 0,
    assignee: issue.assignee?.login ?? null,
    hasChildren: (issue.sub_issues_summary?.total ?? 0) > 0,
    blockedBy: blockersOf(issue.number),
    branch: branchFor(issue),
    startedAt: status === states.inProgress ? issue.updated_at : null,
    lastCommentByLoop:
      status === states.blocked
        ? (latestComment(issue.number)?.body.startsWith(LOOP_PARK_MARKER) ?? false)
        : false,
  };
}

function whoami() {
  const result = spawnSync('gh', ['auth', 'status'], { encoding: 'utf8' });
  if (result.status !== 0) fail('gh is not signed in; run `gh auth login`.', EXIT.noAuth);
  out({ ok: true, me: me(), repo: repo.replace('repos/', '') });
}

function graph(args) {
  const epic = number(args.positional[0]);
  const order = (args.one('order') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const issues = list(`${repo}/issues/${epic}/sub_issues`).map(rankNode);
  out({ mode: 'project', me: me(), order, issues });
}

function queue() {
  const issues = list(`${repo}/issues?state=open&assignee=none&labels=${encodeURIComponent(readyLabel)}`)
    .filter((issue) => !issue.pull_request)
    .map(rankNode)
    .filter((issue) => issue.status === states.todo);
  out({ mode: 'workspace', me: me(), order: [], issues });
}

function issue(args) {
  const n = number(args.positional[0]);
  const data = api('GET', `${repo}/issues/${n}`);
  const parent = spawnSync('gh', ['api', `${repo}/issues/${n}/parent`], { encoding: 'utf8' });
  const comment = latestComment(n);
  out({
    ok: true,
    id: `#${n}`,
    title: data.title,
    status: statusOf(data),
    labels: data.labels.map((l) => l.name),
    assignee: data.assignee?.login ?? null,
    branch: branchFor(data),
    parent: parent.status === 0 ? `#${JSON.parse(parent.stdout).number}` : null,
    children: (data.sub_issues_summary?.total ?? 0) > 0
      ? list(`${repo}/issues/${n}/sub_issues`).map((child) => ({ id: `#${child.number}`, title: child.title }))
      : [],
    blockedBy: blockersOf(n),
    description: data.body ?? '',
    latestComment: comment ? { body: comment.body, author: comment.user.login, at: comment.created_at } : null,
  });
}

function stateChange(target) {
  if (states.shipped.includes(target)) return { state: 'closed', state_reason: 'completed', label: null };
  if (states.dropped.includes(target)) return { state: 'closed', state_reason: 'not_planned', label: null };
  if (target === states.todo) return { state: 'open', label: null };
  if (STATE_LABELS[target]) return { state: 'open', label: STATE_LABELS[target] };
  fail(`Unknown state "${target}". Known: ${[states.todo, ...Object.keys(STATE_LABELS), ...states.shipped, ...states.dropped].join(', ')}`);
}

function addBlockers(n, ids) {
  for (const id of ids) {
    const blocker = api('GET', `${repo}/issues/${number(id)}`);
    api('POST', `${repo}/issues/${n}/dependencies/blocked_by`, { issue_id: blocker.id });
  }
}

function update(args) {
  const n = number(args.positional[0]);
  const current = api('GET', `${repo}/issues/${n}`);
  let labels = current.labels.map((l) => l.name);
  const patch = {};

  if (args.one('title')) patch.title = args.one('title');
  if (args.one('description-file')) patch.body = readFileSync(args.one('description-file'), 'utf8');
  if (args.one('patch-file')) {
    try {
      patch.body = applyPatch(current.body ?? '', JSON.parse(readFileSync(args.one('patch-file'), 'utf8')));
    } catch (error) {
      if (error instanceof PatchError) fail(error.message);
      throw error;
    }
  }
  if (args.one('state')) {
    const change = stateChange(args.one('state'));
    labels = labels.filter((name) => !LABEL_STATES[name]);
    if (change.label) labels.push(change.label);
    patch.state = change.state;
    if (change.state_reason) patch.state_reason = change.state_reason;
  }
  labels = labels.filter((name) => !args.many('remove-label').includes(name));
  labels.push(...args.many('add-label').filter((name) => !labels.includes(name)));
  patch.labels = labels;

  const assignee = args.one('assignee');
  if (assignee === 'me') patch.assignees = [me()];
  else if (assignee === 'none') patch.assignees = [];
  else if (assignee) fail('--assignee takes me or none');

  const updated = api('PATCH', `${repo}/issues/${n}`, patch);
  addBlockers(n, args.many('blocked-by'));
  out({ ok: true, id: `#${n}`, status: statusOf(updated), labels: updated.labels.map((l) => l.name) });
}

function comment(args) {
  const n = number(args.positional[0]);
  const bodyFile = args.one('body-file');
  if (!bodyFile) fail('comment needs a body file: comment #n --body-file F');
  const created = api('POST', `${repo}/issues/${n}/comments`, { body: readFileSync(bodyFile, 'utf8') });
  out({ ok: true, id: `#${n}`, url: created.html_url });
}

function create(args) {
  const title = args.one('title');
  const descriptionFile = args.one('description-file');
  if (!title || !descriptionFile) fail('create needs --title and --description-file');
  const change = stateChange(args.one('state') ?? states.backlog);
  const labels = [...args.many('label'), ...(change.label ? [change.label] : [])];
  const created = api('POST', `${repo}/issues`, {
    title,
    body: readFileSync(descriptionFile, 'utf8'),
    labels,
  });
  if (args.one('parent')) {
    api('POST', `${repo}/issues/${number(args.one('parent'))}/sub_issues`, { sub_issue_id: created.id });
  }
  addBlockers(created.number, args.many('blocked-by'));
  out({ ok: true, id: `#${created.number}`, url: created.html_url, branch: branchFor(created) });
}

const commands = { whoami, graph, queue, issue, update, comment, create };
const [command, ...argv] = process.argv.slice(2);
if (!commands[command]) {
  fail('Usage: github.mjs whoami | graph <#epic> | queue | issue <#n> | update <#n> … | comment <#n> … | create …');
}
commands[command](parseArgs(argv));
