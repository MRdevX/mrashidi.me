# Example PR body

```markdown
## Overview

The notifications worker stopped reporting errors on 6 July. Its error-tracker DSN points at a
hostname whose certificate was renewed that day without covering it, so delivery fails and the
SDK drops every error silently.

## What Changed

| Area | Before | After |
| ---- | ------ | ----- |
| Error-tracker host | `errors-old.acme.dev` | `errors.acme.dev` |
| Error-tracker project | 5 | 5, unchanged |

Only the hostname was wrong. Project 5 on the new host is the same project.

## How to Test

1. Deploy, then schedule a reminder for a session starting more than 15 minutes out.
2. Make the reminder fail by giving the session an unknown recipient.
3. `Reminder delivery refused` appears in project 5 within a minute.

`pnpm ci:affected`

Relates to ABC-123
```
