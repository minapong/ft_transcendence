# Contributing to ft_transcendence

Thank you for contributing to **ft_transcendence**.

This document defines the workflow used in this repository.
Please follow it to keep history clean and collaboration predictable.

## Table of Contents
1. [Branching Rules](#branching-rules)
2. [Development Flow](#development-flow)
3. [Merging Policy](#merging-policy)
4. [Commit Messages](#commit-messages)
5. [Code Quality](#code-quality)
6. [Questions](#questions)
7. [Verify a PR Locally Before Merge](#verify-a-pr-locally-before-merge)
8. [Steps to push to main](#steps-to-push-to-main)

---

## Branching Rules

- **`main`**
  - Milestone snapshots only
  - No direct commits
  - One commit per milestone

- **`dev`**
  - Active integration & deployed branch
  - All feature work is merged here

- **Feature Branches**
  - Branch from `dev`
  - Name format:
    ```
    <name>/<feature>
    ```
    Example:
    ```
    hashir/spa-Reactor
    ```

---

## Development Flow

1. Create a feature branch from `dev`
2. Implement the feature
3. Keep commits small and meaningful
4. Open a Pull Request **into `dev`**
5. Ensure CI passes before requesting review

---

## Merging Policy

- Feature branches → **squash merge** into `dev`
- `dev` → `main` merges are **squashed milestones**
- Direct commits to `main` are not allowed

---

## Commit Messages

Use clear, descriptive commit messages.

Example:
```
[Add] tournament bracket UI
[Fix] WebSocket disconnect handling
```

Avoid:
```
fix
wip
temp
```

---

## Code Quality

- Ensure the project builds successfully
- Do not commit broken or experimental code to `dev`; use a separate branch for that work
- Follow existing code style and structure

---

## Questions

If you are unsure about any rule, ask before pushing.

---

## Verify a PR Locally Before Merge

```bash
# Fetch the PR and create a local branch
git fetch origin pull/<PR_NUMBER>/head:pr-<PR_NUMBER>

# Switch to the PR branch
git switch pr-<PR_NUMBER>

# After review/testing, return to your branch
git switch dev
```

Use this flow to build, test, and review the change locally before approving or merging.

---

## Steps to push to main

**1. Switch to main and update:**
```bash
git checkout main
git pull
```

**2. Merge dev into main (squashed - one commit):**
```bash
git merge --squash dev
```

**3. Create milestone commit:**
```bash
git commit -m "MVP 1 — Core Game Integration" \
  -m "- Integrate Pong and Connect4" \
  -m "- Add basic matchmaking and tournament logic" \
  -m "- Produce Reactor (Frontend SPA library)" \
  -m "- Design database structure"
```

**4. Push to main:**
```bash
git push origin main
```
