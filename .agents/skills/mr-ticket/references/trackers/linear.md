# Linear

Team key and ids (`ABC-12`) come from the **Tracker** Project fact. Two paths, picked by whether the
project has a ticket-loop config (`docs/agent/ticket-loop.json`) and `LINEAR_API_KEY` is set:

```bash
node .agents/loop/linear.mjs whoami     # exit 0: use the script; exit 3 or no config: use the Linear MCP
```

| Need | Script (`.agents/loop/linear.mjs`, JSON out) | Linear MCP |
| ---- | -------------------------------------------- | ---------- |
| Read a ticket | `issue ABC-12` (description, relations, latest comment) | `get_issue`, `list_comments` |
| Comment | `comment ABC-12 --body-file result.md` | `create_comment` |
| Update | `update ABC-12 --state S --add-label L --description-file F` | `update_issue` |
| Create | `create --project P --title T --description-file F [--parent ABC-1] [--label L]` | `create_issue` |
| Find work | `queue`, or `graph <project|ABC-epic>` | `list_issues` with team, assignee, state |

Linear takes Markdown as is: post the draft without conversion. Multi-line text always goes
through a file (`--body-file`, `--description-file`), never shell quoting.

## Finding the PRs

Linear links a PR when its branch name or title contains the id. Look for both:

```bash
gh search prs "ABC-12" --owner <owner> --json number,title,repository,state,url
gh pr list --search "head:abc-12" --state all --json number,title,headRefName,url
```

The issue's own attachments (`issue ABC-12`, or the MCP's `get_issue`) list linked PRs too.

## Body format

New tickets follow `templates/ticket-format.md` (vendored as `.agents/ticket-format.md`). Mentions
are plain `@name`; Linear resolves them.
