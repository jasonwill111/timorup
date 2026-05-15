# Issue Tracker

GitHub Issues via `gh` CLI.

## Commands

```bash
# Create issue
gh issue create --title "..." --body "..." --label "needs-triage"

# Add label to existing issue
gh issue edit <number> --add-label "ready-for-agent"

# List issues by label
gh issue list --label "needs-triage"

# View issue
gh issue view <number>
```

## Workflow

1. Report via `gh issue create`
2. Label with `needs-triage`
3. Triage process assigns one of: `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`
4. When fixed, close via `gh issue close <number>`