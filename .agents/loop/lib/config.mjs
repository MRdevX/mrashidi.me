import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const loopDir = dirname(dirname(fileURLToPath(import.meta.url)));
export const checkoutRoot = dirname(dirname(loopDir));
export const CONFIG_FILE = 'docs/agent/ticket-loop.json';

const STATE_DEFAULTS = {
  backlog: 'Backlog',
  todo: 'Todo',
  inProgress: 'In Progress',
  inReview: 'In Review',
  blocked: 'Blocked',
  shipped: ['Done'],
  dropped: ['Canceled', 'Duplicate'],
};

const ID_SHAPES = {
  linear: { source: '[A-Z][A-Z0-9]+-\\d+', example: 'MAS-12' },
  github: { source: '#\\d+', example: '#12' },
};

export function mainRoot() {
  try {
    const commonDir = execFileSync('git', ['rev-parse', '--path-format=absolute', '--git-common-dir'], {
      cwd: checkoutRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return dirname(commonDir);
  } catch {
    return checkoutRoot;
  }
}

export function loadRootEnv() {
  for (const root of new Set([checkoutRoot, mainRoot()])) {
    for (const name of ['.env', '.env.local']) {
      const path = join(root, name);
      if (!existsSync(path)) continue;
      for (const line of readFileSync(path, 'utf8').split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eq = trimmed.indexOf('=');
        if (eq === -1) continue;
        const key = trimmed.slice(0, eq).trim();
        if (!key || process.env[key] !== undefined) continue;
        let value = trimmed.slice(eq + 1).trim();
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    }
  }
}

export function loopConfig(root = checkoutRoot) {
  const path = join(root, CONFIG_FILE);
  if (!existsSync(path)) {
    throw new Error(`No ${CONFIG_FILE} in ${root}; see the mr-ticket-loop skill for its shape.`);
  }
  const raw = JSON.parse(readFileSync(path, 'utf8'));
  if (!ID_SHAPES[raw.tracker]) throw new Error(`${CONFIG_FILE}: tracker must be linear or github`);
  if (raw.tracker === 'linear' && !raw.team) throw new Error(`${CONFIG_FILE}: linear needs a team key`);
  const shape = ID_SHAPES[raw.tracker];
  return {
    readyLabel: 'agent-ready',
    ...raw,
    states: { ...STATE_DEFAULTS, ...raw.states },
    id: {
      source: shape.source,
      example: raw.tracker === 'linear' ? `${raw.team}-12` : shape.example,
      exact: new RegExp(`^${shape.source}$`),
      number: (id) => Number(/(\d+)$/.exec(id)[1]),
      dirName: (id) => id.replace(/^#/, 'gh-'),
      isDirName: (name) => new RegExp(`^(${shape.source.replace('#', 'gh-')})$`).test(name),
    },
  };
}
