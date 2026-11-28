# Posting a GitHub review

**Submit with the verdict once the user has confirmed the draft.** Mechanics:

```bash
gh api -X POST repos/<owner>/<repo>/pulls/<n>/reviews --input review.json
```

- `review.json` shape: `{commit_id, event, body, comments: [{path, line, side: "RIGHT", body}]}`. `event` is `APPROVE`, `REQUEST_CHANGES` or `COMMENT` and publishes the review at once. Omit `event` only when the user wants a `PENDING` review they submit themselves.
- `commit_id` is the head SHA from `gh pr view <n> --json headRefOid`. Check it again right before posting: if the PR moved since the review, re-check the comments against the new head first.
- `line` must fall inside a diff hunk of a file the PR changes. Get valid anchors with `git diff <base>...<head> -U0 -- <file> | grep '^@@'`; the `+start,count` is the usable range. Line numbers in the response come back as `original_line`, not `line`, and may be null right after creation.
- A file the PR does not touch takes no inline comment at all. Put that point in the review `body` and say why it has no line.
- Keep `review.json` in the scratchpad, so a rewrite edits the file instead of retyping it.
- **Pending comments cannot be edited.** `PATCH /repos/.../pulls/comments/<id>` 404s while the review is pending. To change one, `gh api -X DELETE repos/<o>/<r>/pulls/<n>/reviews/<review_id>` and post the whole review again. Before the DELETE, confirm the review is still `PENDING` and the PR head SHA still matches `commit_id`. A submitted review cannot be deleted; fix a submitted comment by editing it (`PATCH .../pulls/comments/<id>`) or replying.
- In zsh, `set -- $x` does not word-split, so a looped URL comes out malformed and GitHub answers 404. Write each URL out explicitly; a 404 from a loop is the script before it is GitHub.
- Confirm afterwards: `gh api repos/<o>/<r>/pulls/<n>/reviews -q '.[] | "\(.id) \(.state)"'` shows the review in the expected state (`APPROVED`, `CHANGES_REQUESTED`, `COMMENTED` or `PENDING`), and `.../reviews/<id>/comments` matches the draft's comment count. Give the user the review link (`html_url`).

## Threads, replies and resolving (re-review, own PRs)

Read the threads (read-only):

```bash
gh api graphql -F n=<n> -f owner=<owner> -f repo=<repo> -f query='query($owner:String!,$repo:String!,$n:Int!){repository(owner:$owner,name:$repo){pullRequest(number:$n){
  reviewThreads(first:100){nodes{id isResolved isOutdated path line
    comments(first:20){nodes{databaseId author{login} body url}}}}}}}'
```

`id` (`PRRT_…`) is the thread, used to resolve. `databaseId` of the first comment is what a reply attaches to.

- **Reply** in a thread: `gh api -X POST repos/<owner>/<repo>/pulls/<n>/comments/<databaseId>/replies -f body="Fixed in <commit link>, thanks."`. A reply posts at once, outside any review, so each one needs the user's go like everything else.
- **Resolve**: `gh api graphql -f query='mutation{resolveReviewThread(input:{threadId:"PRRT_…"}){thread{isResolved}}}'`. Resolve only threads the user opened; on the user's own PRs the reviewer resolves theirs.
- Commit links in replies: `[abc1234](https://github.com/<owner>/<repo>/pull/<n>/commits/<sha>)`, short SHA as the text.
- Run the `mr-work` skill's `scripts/draft-lint.py --github reply.md` on each reply before showing it.
