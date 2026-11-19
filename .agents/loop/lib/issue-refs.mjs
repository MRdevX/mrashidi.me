// The separator is `[ \t:]` rather than `\s` so a match cannot cross a newline: an empty
// `- Fixes:` template line must not swallow the identifier on the line below.
const closingKeyword = (idSource) =>
  new RegExp(`\\b(?:fix(?:e[sd])?|close[sd]?|resolve[sd]?)[ \\t:]+(?:#(?=[A-Z]))?(${idSource})\\b`, 'gi');

const mergedSubjectSuffix = (idSource) => new RegExp(`\\((${idSource})\\)[ \\t]*$`, 'gm');

export function closingKeysIn(text, idSource) {
  return [...new Set([...text.matchAll(closingKeyword(idSource))].map((m) => m[1].toUpperCase()))];
}

export function mergedKeysIn(text, idSource) {
  return [...new Set([...text.matchAll(mergedSubjectSuffix(idSource))].map((m) => m[1]))];
}
