# Jira via acli

Site, cloudId and project key come from the **Tracker** Project fact. `acli` must be authenticated
against that site: check with `acli auth status`.

## Reading a ticket

```bash
<mr-ticket>/scripts/ticket-context.sh ABC-123 <scratchdir>
```

Writes `ABC-123.md` (fields, description and every comment as readable text) and
`ABC-123.urls.txt` (every link in the ticket, which is how linked PRs are found). Raw commands for
what it does not extract:

```bash
acli jira workitem view ABC-123 --fields '*all' --json     # comments need *all
acli jira workitem comment list --key ABC-123 --json       # lighter, thread only
acli jira workitem search --jql '...' --fields 'key,summary,status' --json
```

## Finding the PRs

The dev panel gives PR *counts*, never URLs. Use `ABC-123.urls.txt` for PRs a human linked, and a
title search for the rest:

```bash
gh search prs "ABC-123" --owner <owner> --limit 50 \
  --json number,title,repository,state,url \
  | jq -r '.[] | select(.title | contains("ABC-123"))
      | "\(.repository.nameWithOwner)#\(.number) [\(.state)] \(.title)"'
```

Filter on **title**. Unfiltered search also matches PRs that merely mention the key.

## Sharp edges

**Descriptions and comments are ADF JSON**, not text. Flatten with `scripts/adf.jq`:

```bash
jq -r -L <mr-ticket>/scripts 'include "adf"; .fields.description | adf2text' ticket.json
```

**Friendly field names are silently ignored.** `--fields Sprint` returns nothing, exit 0, no error.
Use field IDs. On Jira Cloud `customfield_10010` is usually Sprint and `customfield_10000` the dev
panel (`ticket-context.sh` assumes both); check a site's ids with the Atlassian MCP or
`/rest/api/3/field`.

**`acli jira field` has no `list`**, so field IDs cannot be mapped to names through acli.

**`changelog`, `names`, and `renderedFields` come back null.** There is no status-transition
history, so acli cannot answer "when did this enter QA" or "who moved it". Use the Atlassian MCP
server or the REST API for that. Sprint fields and account ids come from the MCP too.

**Attachments list but do not download.** Screenshots have to be opened in a browser.

**The dev panel carries counts and a deployment flag, never PR URLs**, and its "DEPLOYED" says
nothing about which change. It cannot answer "is my fix live"; step 3 of the skill exists because
of this.

## Posting

```bash
acli jira workitem comment create --key ABC-123 --body-file result.json
acli jira workitem comment create --key ABC-123 --body-file result.json --edit-last
acli jira workitem transition --key ABC-123 --status "Done"
```

`--edit-last` rewrites your own last comment in place, which keeps a corrected update from becoming
a second comment.

`--body`/`--body-file` accept plain text **or** ADF JSON, and so do
`--description`/`--description-file` on `workitem create` and `workitem edit`. Plain text is stored
verbatim as flat paragraphs: a Markdown table renders as literal pipes, `#` headings stay prose,
and fenced code loses its block. So write the draft in Markdown and convert it:

```bash
python3 <mr-ticket>/scripts/md2adf.py draft.md > body.json             # tables, panels ([!info] ...), expand, links
jq -r -L <mr-ticket>/scripts 'include "adf"; adf2text' body.json       # round-trip: see what lands
acli jira workitem comment create --key ABC-123 --body-file body.json
```

**Mentions:** acli has no user lookup. Get the accountId with the Atlassian MCP
`lookupJiraAccountId` (search by name or email), then write `@[Display Name](accountId)` in the
draft; md2adf turns it into a mention node that notifies.

## Creating and editing

```bash
acli jira workitem create --project <KEY> --type Story \
  --summary "<summary>" --description-file body.json --assignee "<email>"
acli jira workitem edit --key ABC-123 --description-file body.json
acli jira workitem view ABC-123 --json | jq '.fields.description.content | map(.type)'   # read back
```

`edit` needs `--key`; a positional key fails with `at least one of the flags in the group
[key jql filter generate-json from-json] is required`. `create` takes no `--key`. Expect `panel`
and `heading` among the read-back types; all `paragraph` means the body went in as text.

## Attachments and images

```bash
acli jira workitem attachment list --key ABC-123
acli jira workitem attachment delete --id <id>
```

acli cannot upload or embed. Images that should show inside a comment go through the comment
editor in a browser: Edit the comment, put the cursor at the end, find the editor's `type=file`
input, upload the images (from the scratchpad; the browser extension may not read repo folders),
Save. That both embeds and attaches them; attaching first through the ticket's own file input and
then embedding gives duplicates. The editor's ADF comes back as `mediaSingle` nodes, which is how
to check from acli that the images landed.

## Finding work

```bash
acli jira workitem search --jql 'project = <KEY> AND status = "IN QA" ORDER BY updated DESC' \
  --fields 'key,summary,status,assignee,labels'
```

The board, sprint names and any "verified on staging, waiting on production" label come from the
Tracker fact.

`md2adf.py --selftest` checks the converter.
