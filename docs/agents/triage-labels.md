# Triage Labels

AI-driven development workflow with the following issue states:

| Label | State | Description |
|-------|-------|-------------|
| `needs-triage` | Untriaged | Requires maintainer evaluation |
| `needs-info` | Blocked | Waiting on reporter for more information |
| `ready-for-agent` | Ready | Fully specified, AI agent can pick up immediately |
| `in-progress` | Active | Being worked on by AI or human |
| `wontfix` | Closed | Will not be actioned |

## State Machine

```
needs-triage → needs-info (ask for info)
needs-triage → ready-for-agent (spec complete)
needs-triage → wontfix (invalid)
needs-info → ready-for-agent (info provided)
ready-for-agent → in-progress (agent/human starts)
in-progress → ready-for-agent (blocked/reverted)
in-progress → closed (done or wontfix)
```
