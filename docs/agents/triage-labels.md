# Triage Labels

## Label Vocabulary

| Label | Use When |
|-------|----------|
| `needs-triage` | Maintainer needs to evaluate |
| `needs-info` | Waiting on reporter for more info |
| `ready-for-agent` | Fully specified, AFK-ready (agent can pick up) |
| `ready-for-human` | Needs human implementation |
| `wontfix` | Will not be actioned |

## State Machine

```
needs-triage → needs-info (need more info)
            → ready-for-agent (ready for agent)
            → ready-for-human (needs human)
            → wontfix (won't fix)
```