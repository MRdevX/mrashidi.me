#!/usr/bin/env bash
# The user's own short messages that read like a correction, with the skill that was running.
# Output: date <TAB> skill <TAB> message (clipped). Local read only; a net, so expect false hits.
# Usage: corrections.sh YYYY-MM-DD [project-folder glob, default all]
set -euo pipefail
since=${1:?usage: corrections.sh YYYY-MM-DD [glob]}
glob=${2:-*}
cd ~/.claude/projects
rx='(^|\s)(no[,.! ]|nope|don.?t|do not|wrong|not what|i said|i told|i asked|again|stop|why did you|you forgot|you missed|instead|revert|undo|shouldn.?t|should not|that.?s not|incorrect|too (long|much|many|verbose|noisy))'
find . -path "./$glob" -name '*.jsonl' -newermt "$since" -print0 | while IFS= read -r -d '' f; do
  jq -n -r --arg rx "$rx" --arg since "$since" 'foreach (inputs | select((.timestamp // "") >= $since)) as $e ({skill: "-", out: null};
      .out = null
      | if $e.type == "assistant" then
          ([$e.message.content[]? | select(.type == "tool_use" and .name == "Skill") | .input.skill] | last) as $s
          | if $s then .skill = $s else . end
        elif $e.type == "user" and ($e.isMeta | not) then
          ($e.message.content | if type == "string" then . else ([.[]? | select(.type == "text") | .text] | join(" ")) end) as $t
          | (($t | capture("<command-name>/(?<s>[\\w:-]+)</command-name>") | .s) // null) as $cmd
          | if $cmd then .skill = $cmd
            elif ($t | length) > 0 and ($t | length) < 600 and ($t | startswith("<") | not) and ($t | test($rx; "i"))
            then .out = [($e.timestamp // "")[0:10], .skill, ($t | gsub("\\s+"; " ") | .[0:240])]
            else . end
        else . end;
      .out // empty) | @tsv' "$f" 2>/dev/null || true
done | sort
