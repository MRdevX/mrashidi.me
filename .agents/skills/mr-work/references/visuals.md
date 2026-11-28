# Diagrams, documents and artifacts

Pick the lightest form that makes the point clear. A visual supports the What / Why / How / Evidence explanation; it never replaces it.

| Form | When | Examples |
| --- | --- | --- |
| Chat: a table, or a small Mermaid or ASCII diagram | One flow, a before/after, a decision | request path through the slices, a state change |
| Mermaid block in `docs/plans/<ticket>.md` | The diagram belongs to the plan and should outlive the chat | sequence of the new flow, rollout order, which service calls which |
| Artifact (private claude.ai page; load `artifact-design`, and `artifact-diagramming` for diagrams) | Several diagrams together, something to click through, or something the user will show someone | plan overview (flow diagram, AC to proof map, risks); investigation board (hypotheses, evidence, error timeline from Sentry and logs); review summary of a large PR; verification report with screenshots |
| Claude Doc (load `anthropic-skills:docs`) | Writing the team will read, edit and comment on | ADR or proposal, design note for a cross-repo change, postmortem |

Artifacts and decks use the design system the Project facts name, if any; read its README before writing the page.

## When

- **Always, without asking**: a Mermaid diagram in the plan file when the change crosses a service or gRPC boundary or changes a data flow (`sequenceDiagram` for calls, `flowchart` for states and rollout).
- **Ask** at G1, at the end of an investigation, and at the final report when the work is big: more than one service, a contract change, a migration, or more than three hypotheses. Add it to that gate's AskUserQuestion: "Chat / Artifact / Doc" with a recommendation and what the page would contain.
- **Small work stays in chat** and does not ask.
- The user asking for a page, a diagram, a doc or "something I can share" always wins.

## Safety

Artifacts and Docs are hosted on claude.ai. They hold IDs, counts, statuses, release tags, file paths and code only. Never personal or health data, transcripts, raw log payloads, request headers, tokens or credentials, and nothing from `.env*`, Vault or `secrets/`. Pages are private; sharing is the user's call. Give the link and say it is private.

## Diagram hygiene

- Draw the real mechanism from the code you read, with real names (service names, ports, queue names), not boxes labelled "Service A".
- One idea per diagram. Mark what changes (new, changed, removed) and keep everything else grey or plain.
- Before shipping, check every arrow against the code or the logs. A wrong diagram is worse than none.
