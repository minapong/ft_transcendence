# Contributing to ft_transcendence

This guide is the source of truth for our workflow.

## Scope

- All active work merges into `Dev`
- Only milestone snapshots are merged into `main`

## Branching Model

- `main`: milestone snapshots only, no direct commits
- `Dev`: integration branch for all features
- Feature branches: branch off `Dev`

## First-Time Setup

```bash
git clone <repo-url>
cd ft_transcendence
git checkout Dev
```

## Start a Feature Branch

Branch naming:

```
<name>/<feature>
```

Create and switch:

```bash
git checkout -b <name>/<feature>
```

## Work and Commit

```bash
git status
git add .
git commit -m "[PREFIX] message"
```

## Keep Your Branch Updated

```bash
git checkout <name>/<feature>
git pull origin Dev
```

Resolve conflicts, then commit the merge:

```bash
git add .
git commit
```

## Open a Pull Request

1. Push your branch:

   ```bash
   git push -u origin <name>/<feature>
   ```

2. Open a PR on GitHub:
   - Base: `Dev`
   - Compare: your branch

## Merge Policy

- Feature branch → `Dev`: squash merge only
- `Dev` → `main`: squash into a single milestone commit
- Never push directly to `main`

## Commit Message Format

Use one of these prefixes:

```
[ADD] feature or module
[FIX] bug fix
[UPDATE] refactor or improvement
```

Examples:

```
[ADD] tournament creation endpoint
[FIX] connect4 matchmaking cleanup
[UPDATE] tighten auth validation
```

## Verify a PR Locally

```bash
git fetch origin pull/<PR_NUMBER>/head:pr-<PR_NUMBER>
git switch pr-<PR_NUMBER>
```

After review:

```bash
git switch Dev
```

## Release to Main (Maintainers)

```bash
git checkout main
git pull
git merge --squash Dev
git commit -m "Milestone: <short title>"
git push origin main
```
