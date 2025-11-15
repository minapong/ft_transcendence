# Contributing to ft_transcendence

Thank you for contributing to **ft_transcendence**.

This document defines the workflow used in this repository.
Please follow it to keep history clean and collaboration predictable.

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
- Do not commit broken or experimental code to `dev` create seperate branch for that
- Follow existing code style and structure

---

## Questions

If you are unsure about any rule, ask before pushing.

---

## Steps to push to main
```bash
git checkout main
git pull
git merge --squash dev
git commit -m "MVP 1 – initial integrated version"
git push origin main
```
