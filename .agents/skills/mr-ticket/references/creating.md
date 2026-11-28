# Filing a ticket

The body is the deliverable. A ticket someone cannot act on without asking you a question is a
failed ticket.

## Format

If the **Tracker** Project fact names reference tickets for the team's format, read them first and
copy their shape; never invent one. Otherwise use this frame, top to bottom, leaving out any part
the ticket has nothing for:

1. **Context** (optional): one plain paragraph on why, before the story. Dates and deadlines in
   **bold**.
2. **User story** in a blue panel (`[!panel #DEEBFF]`), one italic sentence:
   *As a <user> I want … so …*.
3. **Label lines**: a paragraph starting with a bold label.
   - `Design:` design links, one per state, joined by ` · `.
   - `Depends on:` ticket ids as plain text.
4. **Detail** under bold paragraph labels (`What the card shows`, `Scope`), not headings: a bullet
   list, or a table with a header row. UI copy is always a table with one column per locale, never
   prose. Short notes after it are one sentence per paragraph, naming the sibling ticket that covers
   anything adjacent.
5. `## Acceptance Criteria` (heading level 2), then a `success` panel holding a numbered list. One
   observable outcome per item, user words, no trailing period.
6. `### Out of scope` (level 3), then an `error` panel holding a numbered list.
7. `## Dev notes` (optional): component names, code pointers, how to test. Identifiers in code
   marks, commands in a code block.
8. **Open** as a bold label, then a bullet list of questions nobody has answered yet. Always last.

Bugs keep the same frame: the context paragraph says what happens and ends on an `Impact:` line,
and a numbered `Steps to reproduce` list (each with its command and expected result) goes in the
detail. Acceptance criteria still go in the success panel, not `[ ] ` bullets.

On Linear or GitHub, where panels do not exist, use the same order with `> [!NOTE]`-style alerts
or plain headings, or `templates/ticket-format.md` when the project vendors it.

**Summary**: `[FE]`, `[BE]` or a feature tag, then what the user gets, short:
`[FE] Upcoming session card`, `[BE] Endpoint: upcoming sessions`. A bug summary is the symptom a
human would report, not the cause.

## Draft in Markdown

Callout syntax is in the `mr-work` skill's `references/writing.md`:

```markdown
> [!panel #DEEBFF]
> *As a user I want ... so ...*

**Design:** [State A](https://...) · [State B](https://...)
**Depends on:** ABC-100

**What the card shows**

| When | EN | DE |
| --- | --- | --- |
| 15 min before start | Your next session ... | Deine nächste Sitzung ... |

## Acceptance Criteria

> [!success]
> 1. The card doesn't show earlier than 15 min before the session

### Out of scope

> [!error]
> 1. ...

**Open**

- DE copy for "Coach:"
```

On Jira, convert it to ADF and never post plain text: `--description-file` stores plain text as
flat paragraphs, headings become prose, panels and tables vanish, and the create confirmation gives
no hint that it happened. Create, edit and read-back commands: the tracker adapter in
[`trackers/`](trackers/).

## Read it back

Always verify, because a wrongly formatted body reports success and renders wrong. On Jira expect
`panel` and `heading` among the description's node types; all `paragraph` means the body went in as
text: rebuild and edit.

## Reformatting an existing ticket

Only tickets the user reported; never someone else's. Keep every fact, link, id and decision; only
the shape changes. Save the old description to the scratchpad first, since the tracker may show no
history to restore from, and show the new body before the edit.

## Content

- **Test steps** belong in the ticket, each with the real command and its expected result. Include
  the control case whenever success and failure return the same thing, or the steps prove nothing.
- **Acceptance criteria** are the spec the fix is judged against. Include the constraint that makes
  the fix non-trivial, not only the happy path, so a later "simplification" cannot undo it.
- Tone and wording: the `mr-work` skill's `references/writing.md`. Library internals go in Dev
  notes, never the story or criteria.
