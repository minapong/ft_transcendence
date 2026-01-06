# Contributing to ft_transcendence

Thanks for contributing. This guide is the single source of truth for our workflow.

## Table of Contents

1. [What This File Is For](#scope)
2. [Which Branch Do I Use?](#branching-model)
3. [First-Time Setup](#one-time-setup)
4. [Create a Feature Branch](#start-a-feature-branch)
5. [Work & Commit](#work-and-commit)
6. [Sync with Dev](#keep-your-branch-updated)
7. [Open a Pull Request](#open-a-pull-request)
8. [Release to Main (Maintainers Only)](#release-to-main-maintainers)

## What This File Is For {#scope}

This document covers how we contribute code to this repo:

- All active work merges into `Dev`
- Only milestone snapshots are merged into `main`

## Branching Model

Use these branches as follows:

- `main`: milestone snapshots only, no direct commits
- `Dev`: integration branch for all features
- Feature branches: always branch from `Dev`

## Table of Contents
1. [What This File Is For](#scope)
2. [Which Branch Do I Use?](#branching-model)
3. [First-Time Setup](#one-time-setup)
4. [Create a Feature Branch](#start-a-feature-branch)
5. [Work & Commit](#work-and-commit)
6. [Sync with Dev](#keep-your-branch-updated)
7. [Open a Pull Request](#open-a-pull-request)
8. [Release to Main (Maintainers Only)](#release-to-main-maintainers)

## One-Time Setup

This document covers how we contribute code to this repo:

- All active work merges into `Dev`
- Only milestone snapshots are merged into `main`
git pull
```

Use these branches as follows:

- `main`: milestone snapshots only, no direct commits
- `Dev`: integration branch for all features
- Feature branches: always branch from `Dev`

Feature branch naming:

```
<name>/<feature>
```

```bash
git status
git add .
<name>/<feature>
```

## Keep Your Branch Updated

Before opening a PR, merge `Dev` into your branch to avoid conflicts:

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
   - Title and description should be clear and specific

## Merge Policy

- Feature branch -> `Dev`: squash merge only
- `Dev` -> `main`: squash into a single milestone commit
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
