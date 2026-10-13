---
name: house-review
description: >-
  Reviews a branch or PR against the house rules and the project's accepted decision
  records. Use when reviewing a PR, a branch, or work in progress before merging.
---

# House review

The deliverable is a review. Do not push, approve, or merge.

## 1. Inputs

- Diff: `git fetch origin && git diff origin/main...HEAD` (or `gh pr diff <n>`).
- Intent: the PR title and body (`gh pr view <n>`), and the linked issue.
- Standards: `house-rules.md`, the project `AGENTS.md` (Project facts), `.cursor/rules/`,
  accepted records in the decision records folder, and the stack doc.

Done when you can state what the change is meant to do in one sentence.

## 2. Check every changed file

| Check | Fails when |
| ----- | ---------- |
| Spec | The change misses or exceeds what the PR or issue asks for |
| Decisions | It contradicts an accepted record without superseding it |
| Slices and layers | Domain imports framework code; a slice reaches into another's internals; validation outside the boundary |
| Simplicity | Speculative options or abstractions; one-caller indirection; duplicated knowledge |
| Comments | Any added comment fails the bar in `house-comments` |
| Dead code | Unused exports, files, deps, or commented-out code added or left in touched files |
| Framework use | An API that is deprecated or off-convention for the pinned version |
| Tests | New behaviour has no test, or tests assert implementation details |
| Hygiene | Cleanup mixed into a behaviour commit; a commit message that is not a single conventional line, has a body or trailers, or carries agent attribution |
| PR body | Not the `house-pr` format or the project's PR template; endpoints, breaking changes, or the project's issue references missing |

Read the code around each change, not just the hunk. Done when every row has been applied to
every changed file.

## 3. Report

```
## Findings
1. [blocker|should-fix|nit] path/to/file.ts:42: what is wrong, and why it matters.
   Suggested fix: one line.

## Verdict
merge-ready | needs changes (list) | blocked on a question for the author
```

Order findings by severity. Cite the rule or record (`DR-0008`, house rules §2) for each.
Skip praise and restating the diff.
