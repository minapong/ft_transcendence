# Docker Setup

Docker Compose files for local development and production-like runs.

## Files

- `Docker/docker-compose.yml` — base services (frontend + backend)
- `Docker/docker-compose.dev.yml` — dev overrides (volumes, ports, env)
- `docker-compose.prod.yml` — production images + nginx + TLS
- `docker-compose.localprod.yml` — local prod with nginx on `8443`
- `nginx/` — nginx configs and TLS assets

## Common Commands

Development (build + run):

```bash
make dev
```

Development with seed:

```bash
make dev-seed
```

Production:

```bash
make prod
```

Local production with seed:

```bash
make prod-seed
```

## Ports

- Dev frontend: `5173`
- Dev backend: `3000`
- Prod nginx: `80` / `443`
- Local-prod nginx: `8443` (TLS)
