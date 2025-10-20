# Configuration
COMPOSE_BASE = docker-compose.yml
COMPOSE_DEV = docker-compose.dev.yml
COMPOSE_PROD = docker-compose.prod.yml

# Container names (optional; for clarity)
PROJECT_NAME = game_app

# Default target
.DEFAULT_GOAL := help

# ==============================================================================
# 🧩 Build Targets
# ==============================================================================

build-dev:
	@echo "🛠️  Building development images..."
	docker compose -p $(PROJECT_NAME)_dev -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) build

build-prod:
	@echo "🏗️  Building production images..."
	docker compose -p $(PROJECT_NAME)_prod -f $(COMPOSE_BASE) -f $(COMPOSE_PROD) build

# ==============================================================================
# 🚀 Run Targets
# ==============================================================================

dev: build-dev
	@echo "🚀 Starting development environment..."
	docker compose -p $(PROJECT_NAME)_dev -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) up

prod: build-prod
	@echo "🌐 Starting production environment..."
	docker compose -p $(PROJECT_NAME)_prod -f $(COMPOSE_BASE) -f $(COMPOSE_PROD) up -d

# ==============================================================================
# 🧹 Cleanup Targets
# ==============================================================================

clean:
	@echo "🧼 Stopping and removing containers..."
	docker compose -p $(PROJECT_NAME)_dev -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) down
	docker compose -p $(PROJECT_NAME)_prod -f $(COMPOSE_BASE) -f $(COMPOSE_PROD) down

fclean: clean
	@echo "🔥 Removing all images and volumes..."
	docker system prune -af --volumes

# ==============================================================================
# 🔁 Rebuild Target
# ==============================================================================

re: fclean
	@echo "♻️  Rebuilding everything from scratch..."
	make build-dev
	make build-prod

# ==============================================================================
# 📘 Help
# ==============================================================================

help:
	@echo "Available targets:"
	@echo "  make dev        → Run development environment (with hot reload)"
	@echo "  make prod       → Run production environment (detached mode)"
	@echo "  make build-dev  → Build dev Docker images"
	@echo "  make build-prod → Build prod Docker images"
	@echo "  make clean      → Stop and remove containers"
	@echo "  make fclean     → Full cleanup (containers, images, volumes)"
	@echo "  make re         → Rebuild everything from scratch"
