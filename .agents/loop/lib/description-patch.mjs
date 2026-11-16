export class PatchError extends Error {}

function fail(message) {
  throw new PatchError(message);
}

function onlyMatch(text, needle, op) {
  const at = text.indexOf(needle);
  if (at === -1) fail(`${op}: anchor not found: ${JSON.stringify(needle.slice(0, 80))}`);
  if (text.indexOf(needle, at + 1) !== -1)
    fail(`${op}: anchor matches more than once: ${JSON.stringify(needle.slice(0, 80))}`);
  return at;
}

export function applyPatch(text, ops) {
  return ops.reduce((current, op) => {
    switch (op.op) {
      case 'replace':
        if (op.replace_all) {
          if (!current.includes(op.old_string))
            fail(`replace: anchor not found: ${JSON.stringify(op.old_string.slice(0, 80))}`);
          return current.split(op.old_string).join(op.new_string);
        }
        onlyMatch(current, op.old_string, 'replace');
        return current.replace(op.old_string, () => op.new_string);
      case 'insert_before': {
        const at = onlyMatch(current, op.anchor, 'insert_before');
        return current.slice(0, at) + op.text + current.slice(at);
      }
      case 'insert_after': {
        const at = onlyMatch(current, op.anchor, 'insert_after') + op.anchor.length;
        return current.slice(0, at) + op.text + current.slice(at);
      }
      case 'prepend':
        return op.text + current;
      case 'append':
        return current + op.text;
      case 'replace_range': {
        const from = onlyMatch(current, op.from, 'replace_range');
        const to = current.indexOf(op.to, from + op.from.length);
        if (to === -1)
          fail(
            `replace_range: end anchor not found after start: ${JSON.stringify(op.to.slice(0, 80))}`,
          );
        return current.slice(0, from) + op.new_string + current.slice(to);
      }
      default:
        return fail(`Unknown patch op: ${op.op}`);
    }
  }, text);
}
