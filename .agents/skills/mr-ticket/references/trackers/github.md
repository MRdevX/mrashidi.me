# GitHub issues

Ids are `#123` in the current repo, or `owner/repo#123`. No Tracker fact beyond `github` is
needed.

```bash
gh issue view 123 --comments                                  # description and thread
gh issue view 123 --json title,body,labels,state,assignees,comments,url
gh issue comment 123 --body-file result.md
gh issue comment 123 --edit-last --body-file result.md        # correct your last comment
gh issue create --title "<summary>" --body-file body.md --label <label>
gh issue edit 123 --body-file body.md --add-label <label>
gh issue list --assignee @me --state open --json number,title,labels,updatedAt
```

GitHub renders Markdown and alerts (`> [!NOTE]`) as is: post the draft without conversion.
Mentions are `@login` and notify, so write one only for a real login you mean to notify.

## Finding the PRs

```bash
gh issue view 123 --json closedByPullRequestsReferences -q '.closedByPullRequestsReferences[] | "\(.number) \(.url)"'
gh search prs "#123" --repo <owner>/<repo> --json number,title,state,url
```

The first lists PRs that close the issue (`Fixes #123`, the **Issue reference** fact); the second
catches PRs that only mention it.
