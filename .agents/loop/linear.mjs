#!/usr/bin/env node
// Linear for the ticket loop and ticket refine, over the API with LINEAR_API_KEY. The team key,
// ready label and state names come from docs/agent/ticket-loop.json.
// Every command prints JSON. Reads take an id or a project; writes take files for any
// multi-line text so nothing passes through shell quoting.
//
//   whoami                                   -> the key's user; exit 3 when no key is set
//   graph <project|TEAM-epic> [--order …]     -> rank input for `agent-loop.mjs rank`
//   queue                                    -> rank input for workspace mode
//   issue <TEAM-nn>                          -> description, relations, latest comment
//   update <TEAM-nn> [--state S] [--assignee me|none] [--title T]
//          [--add-label L]... [--remove-label L]... [--blocked-by TEAM-x]...
//          [--description-file F | --patch-file F]
//   comment <TEAM-nn> --body-file F
//   create --project P --title T --description-file F [--team TEAM] [--parent TEAM-n]
//          [--state S] [--label L]... [--blocked-by TEAM-x]...
//
// Exit codes: 0 ok, 1 error, 3 LINEAR_API_KEY not set.

import { readFileSync } from 'node:fs';
import { applyPatch, PatchError } from './lib/description-patch.mjs';
import { loadRootEnv, loopConfig } from './lib/config.mjs';
import { linearGraphql } from './lib/linear-api.mjs';

const EXIT = { ok: 0, error: 1, noKey: 3 };
const LOOP_PARK_MARKER = 'Parked by the ticket loop';
const PAGE = 100;
const LIST_PAGE = 25;

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

loadRootEnv();
const token = process.env.LINEAR_API_KEY;
let config;
try {
  config = loopConfig();
} catch (error) {
  fail(error.message);
}
const { states, readyLabel, team: teamKey } = config;

async function gql(query, variables) {
  try {
    return await linearGraphql(token, query, variables);
  } catch (error) {
    fail(error.message);
  }
}

const ISSUE_NODE = `
  id identifier title priority startedAt branchName
  state { name } labels(first: 10) { nodes { name } } assignee { name }
  children(first: 1) { nodes { id } }
  inverseRelations(first: 20) { nodes { type issue { identifier } } }
`;

function blockersOf(node) {
  return node.inverseRelations.nodes
    .filter((r) => r.type === 'blocks')
    .map((r) => r.issue.identifier);
}

function latest(comments) {
  return comments.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt))[0] ?? null;
}

async function lastCommentByLoop(id) {
  const data = await gql(
    `query($id: String!) { issue(id: $id) { comments(first: ${PAGE}) { nodes { body createdAt } } } }`,
    { id },
  );
  return latest(data.issue.comments.nodes)?.body.startsWith(LOOP_PARK_MARKER) ?? false;
}

async function rankInput(mode, nodes, order) {
  const viewer = await gql('query { viewer { name } }');
  const issues = [];
  for (const node of nodes) {
    issues.push({
      id: node.identifier,
      title: node.title,
      status: node.state.name,
      labels: node.labels.nodes.map((l) => l.name),
      priority: Math.round(node.priority),
      assignee: node.assignee?.name ?? null,
      hasChildren: node.children.nodes.length > 0,
      blockedBy: blockersOf(node),
      branch: node.branchName,
      startedAt: node.startedAt,
      lastCommentByLoop:
        node.state.name === states.blocked ? await lastCommentByLoop(node.identifier) : false,
    });
  }
  return { mode, me: viewer.viewer.name, order, issues };
}

async function allIssues(query, variables, pick) {
  const nodes = [];
  let after = null;
  do {
    const page = pick(await gql(query, { ...variables, after }));
    nodes.push(...page.nodes);
    after = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
  } while (after);
  return nodes;
}

async function projectId(name) {
  const data = await gql(
    `query($name: String!) { projects(filter: { or: [{ name: { eqIgnoreCase: $name } }, { slugId: { eq: $name } }] }) { nodes { id name } } }`,
    { name },
  );
  const [project, extra] = data.projects.nodes;
  if (!project) fail(`No Linear project named ${name}`);
  if (extra)
    fail(
      `More than one project matches ${name}: ${data.projects.nodes.map((p) => p.name).join(', ')}`,
    );
  return project.id;
}

async function scopeIssues(scope) {
  if (/^[A-Z]+-\d+$/.test(scope)) {
    return allIssues(
      `query($id: String!, $after: String) { issue(id: $id) { children(first: ${LIST_PAGE}, after: $after) {
         pageInfo { hasNextPage endCursor } nodes { ${ISSUE_NODE} } } } }`,
      { id: scope },
      (data) => data.issue.children,
    );
  }
  const id = await projectId(scope);
  return allIssues(
    `query($id: String!, $after: String) { project(id: $id) { issues(first: ${LIST_PAGE}, after: $after) {
       pageInfo { hasNextPage endCursor } nodes { ${ISSUE_NODE} } } } }`,
    { id },
    (data) => data.project.issues,
  );
}

async function graph(args) {
  const [scope] = args.positional;
  if (!scope)
    fail(`graph needs a project or an epic: graph <project|${teamKey}-nn> [--order ${teamKey}-a,${teamKey}-b]`);
  const nodes = await scopeIssues(scope);
  const order = (args.one('order') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  out(await rankInput('project', nodes, order));
}

async function queue() {
  const nodes = await allIssues(
    `query($after: String, $team: String!, $label: String!, $state: String!) { issues(first: ${LIST_PAGE}, after: $after, filter: {
       team: { key: { eq: $team } }, labels: { some: { name: { eq: $label } } },
       state: { name: { eq: $state } }, assignee: { null: true } }) {
       pageInfo { hasNextPage endCursor } nodes { ${ISSUE_NODE} } } }`,
    { team: teamKey, label: readyLabel, state: states.todo },
    (data) => data.issues,
  );
  out(await rankInput('workspace', nodes, []));
}

async function issue(args) {
  const [id] = args.positional;
  if (!id) fail(`issue needs an id: issue ${teamKey}-nn`);
  const { issue: node } = await gql(
    `query($id: String!) { issue(id: $id) {
       identifier title description priority branchName url
       state { name } labels { nodes { name } } assignee { name }
       project { name } team { key } parent { identifier title }
       children(first: ${PAGE}) { nodes { identifier title state { name } } }
       relations(first: 50) { nodes { type relatedIssue { identifier } } }
       inverseRelations(first: 50) { nodes { type issue { identifier } } }
       comments(first: ${PAGE}) { nodes { body createdAt user { name } } } } }`,
    { id },
  );
  const comment = latest(node.comments.nodes);
  out({
    ok: true,
    id: node.identifier,
    title: node.title,
    status: node.state.name,
    labels: node.labels.nodes.map((l) => l.name),
    priority: Math.round(node.priority),
    assignee: node.assignee?.name ?? null,
    project: node.project?.name ?? null,
    team: node.team.key,
    parent: node.parent,
    branch: node.branchName,
    url: node.url,
    children: node.children.nodes.map((c) => ({
      id: c.identifier,
      title: c.title,
      status: c.state.name,
    })),
    blockedBy: blockersOf(node),
    blocks: node.relations.nodes
      .filter((r) => r.type === 'blocks')
      .map((r) => r.relatedIssue.identifier),
    related: [
      ...node.relations.nodes
        .filter((r) => r.type === 'related')
        .map((r) => r.relatedIssue.identifier),
      ...node.inverseRelations.nodes
        .filter((r) => r.type === 'related')
        .map((r) => r.issue.identifier),
    ],
    latestComment: comment && {
      body: comment.body,
      createdAt: comment.createdAt,
      by: comment.user?.name ?? null,
    },
    description: node.description ?? '',
  });
}

function readText(path) {
  try {
    return readFileSync(path, 'utf8');
  } catch (error) {
    fail(`Cannot read ${path}: ${error.message}`);
  }
}

async function teamContext(teamId) {
  const data = await gql(
    `query($id: String!) { team(id: $id) { id key states { nodes { id name } } } issueLabels(first: 250) { nodes { id name team { id } } } }`,
    { id: teamId },
  );
  const states = data.team.states.nodes;
  const labels = data.issueLabels.nodes.filter((l) => !l.team || l.team.id === teamId);
  return {
    stateId(name) {
      const state = states.find((s) => s.name.toLowerCase() === name.toLowerCase());
      if (!state)
        fail(
          `Team ${data.team.key} has no state "${name}". Known: ${states.map((s) => s.name).join(', ')}`,
        );
      return state.id;
    },
    labelId(name) {
      const label = labels.find((l) => l.name.toLowerCase() === name.toLowerCase());
      if (!label) fail(`No label "${name}" for team ${data.team.key}`);
      return label.id;
    },
  };
}

async function issueRef(id) {
  const data = await gql(
    `query($id: String!) { issue(id: $id) { id identifier description team { id }
       inverseRelations(first: 50) { nodes { type issue { identifier } } } } }`,
    { id },
  );
  return data.issue;
}

async function addBlockers(target, blockerIds) {
  const existing = new Set(blockersOf(target));
  const added = [];
  for (const blockerId of blockerIds) {
    if (existing.has(blockerId)) continue;
    const blocker = await issueRef(blockerId);
    await gql(
      `mutation($input: IssueRelationCreateInput!) { issueRelationCreate(input: $input) { success } }`,
      { input: { issueId: blocker.id, relatedIssueId: target.id, type: 'blocks' } },
    );
    added.push(blockerId);
  }
  return added;
}

async function assigneeId(value) {
  if (value === 'none') return null;
  if (value !== 'me') fail('--assignee takes me or none');
  return (await gql('query { viewer { id } }')).viewer.id;
}

async function update(args) {
  const [id] = args.positional;
  if (!id) fail(`update needs an id: update ${teamKey}-nn [flags]`);
  if (args.one('description-file') && args.one('patch-file'))
    fail('Pass --description-file or --patch-file, not both');
  const target = await issueRef(id);
  const team = await teamContext(target.team.id);
  const input = {};
  if (args.one('state')) input.stateId = team.stateId(args.one('state'));
  if (args.one('assignee')) input.assigneeId = await assigneeId(args.one('assignee'));
  if (args.one('title')) input.title = args.one('title');
  if (args.many('add-label').length)
    input.addedLabelIds = args.many('add-label').map((l) => team.labelId(l));
  if (args.many('remove-label').length)
    input.removedLabelIds = args.many('remove-label').map((l) => team.labelId(l));
  if (args.one('description-file')) input.description = readText(args.one('description-file'));
  if (args.one('patch-file')) {
    const ops = JSON.parse(readText(args.one('patch-file')));
    try {
      input.description = applyPatch(
        target.description ?? '',
        Array.isArray(ops) ? ops : ops.patch,
      );
    } catch (error) {
      if (error instanceof PatchError) fail(error.message);
      throw error;
    }
  }
  if (Object.keys(input).length) {
    await gql(
      `mutation($id: String!, $input: IssueUpdateInput!) { issueUpdate(id: $id, input: $input) { success } }`,
      { id: target.id, input },
    );
  }
  const blockersAdded = await addBlockers(target, args.many('blocked-by'));
  out({ ok: true, id: target.identifier, updated: Object.keys(input), blockersAdded });
}

async function comment(args) {
  const [id] = args.positional;
  const bodyFile = args.one('body-file');
  if (!id || !bodyFile) fail(`comment needs an id and a body file: comment ${teamKey}-nn --body-file F`);
  const target = await issueRef(id);
  await gql(`mutation($input: CommentCreateInput!) { commentCreate(input: $input) { success } }`, {
    input: { issueId: target.id, body: readText(bodyFile) },
  });
  out({ ok: true, id: target.identifier });
}

async function create(args) {
  const project = args.one('project');
  const title = args.one('title');
  const descriptionFile = args.one('description-file');
  if (!project || !title || !descriptionFile) {
    fail('create needs --project, --title and --description-file');
  }
  const teams = await gql(
    `query($key: String!) { teams(filter: { key: { eq: $key } }) { nodes { id } } }`,
    {
      key: args.one('team') ?? teamKey,
    },
  );
  const teamId = teams.teams.nodes[0]?.id;
  if (!teamId) fail(`No team with key ${args.one('team') ?? teamKey}`);
  const team = await teamContext(teamId);
  const input = {
    teamId,
    title,
    description: readText(descriptionFile),
    projectId: await projectId(project),
    stateId: team.stateId(args.one('state') ?? states.backlog),
    labelIds: args.many('label').map((l) => team.labelId(l)),
  };
  if (args.one('parent')) input.parentId = (await issueRef(args.one('parent'))).id;
  const data = await gql(
    `mutation($input: IssueCreateInput!) { issueCreate(input: $input) { issue { id identifier branchName url
       inverseRelations(first: 1) { nodes { type issue { identifier } } } } } }`,
    { input },
  );
  const created = data.issueCreate.issue;
  const blockersAdded = await addBlockers(created, args.many('blocked-by'));
  out({
    ok: true,
    id: created.identifier,
    branch: created.branchName,
    url: created.url,
    blockersAdded,
  });
}

async function whoami() {
  const data = await gql('query { viewer { name } organization { urlKey } }');
  out({ ok: true, user: data.viewer.name, workspace: data.organization.urlKey });
}

const COMMANDS = { whoami, graph, queue, issue, update, comment, create };

const [command, ...rest] = process.argv.slice(2);
const run = COMMANDS[command];
if (!run) fail(`Usage: linear.mjs <${Object.keys(COMMANDS).join('|')}> ...`);
if (!token) {
  fail(
    'LINEAR_API_KEY is not set. Put it in the main checkout .env (see docs/agent/ticket-loop.md), or use the Linear MCP.',
    EXIT.noKey,
  );
}
await run(parseArgs(rest));
