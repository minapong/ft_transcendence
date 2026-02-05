# Configuration
COMPOSE_BASE = Docker/docker-compose.yml
COMPOSE_DEV = Docker/docker-compose.dev.yml
COMPOSE_PROD = ./docker-compose.prod.yml
COMPOSE_LOCALPROD = ./docker-compose.localprod.yml

# Container names (optional; for clarity)
PROJECT_NAME = game_app

# Default target
.DEFAULT_GOAL := all

# ==============================================================================
# 🧩 Build Targets
# ==============================================================================
build-dev:
	@echo "🛠️  Building development images..."
	docker compose -p $(PROJECT_NAME)_dev -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) build

build-prod:
	@echo "🏗️  Building production images..."
	docker compose -p $(PROJECT_NAME)_prod -f $(COMPOSE_PROD) build

build-local-prod:
	@echo "🏗️  Building production images..."
	docker compose -p $(PROJECT_NAME)_prod -f $(COMPOSE_LOCALPROD) build

# ==============================================================================
# 🌱 Database Seeding
# ==============================================================================
seed-dev:
	@echo "🌱 Seeding database (dev)..."
	docker compose -p $(PROJECT_NAME)_dev \
		-f $(COMPOSE_BASE) -f $(COMPOSE_DEV) \
		exec backend npm run seed

seed-prod:
	@echo "🌱 Seeding database (prod)..."
	docker compose -p $(PROJECT_NAME)_prod \
		-f $(COMPOSE_LOCALPROD) \
		exec backend npm run seed:prod

all: prod-seed

# ==============================================================================
# 🚀 Run Targets
# ==============================================================================
dev: build-dev
	@echo "🚀 Starting development environment..."
	docker compose -p $(PROJECT_NAME)_dev -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) up

prod: build-prod
	@echo "🌐 Starting production environment..."
	docker compose -p $(PROJECT_NAME)_prod -f $(COMPOSE_PROD) up -d


# ==============================================================================
# 🌱 Bootstrap (build + run + seed)
# ==============================================================================
dev-seed: build-dev
	@echo "🚀 Starting development environment (with seed)..."
	docker compose -p $(PROJECT_NAME)_dev -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) up -d
	@echo "🌱 Seeding development database..."
	make seed-dev

prod-seed: build-local-prod
	@echo "🌐 Starting production environment (with seed)..."
	docker compose -p $(PROJECT_NAME)_prod -f $(COMPOSE_LOCALPROD) up -d
	@echo "🌱 Seeding production database..."
	make seed-prod

# ==============================================================================
# 🧹 Cleanup Targets
# ==============================================================================

clean:
	@echo "🧼 Stopping and removing containers..."
	docker compose -p $(PROJECT_NAME)_dev -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) down
	docker compose -p $(PROJECT_NAME)_prod -f $(COMPOSE_LOCALPROD) down

fclean: clean
	@echo "🧹 Removing dist/..."
	rm -rf Backend/dist/
	@echo "🔥 Removing all images and volumes..."
	docker system prune -af --volumes
	@if docker volume inspect game_app_prod_backend_node_modules >/dev/null 2>&1; then \
		echo "💿Removing game_app_prod_backend_node_modules..."; \
		docker volume rm game_app_prod_backend_node_modules; \
	else \
		echo "Volume game_app_prod_backend_node_modules does not exist."; \
	fi

	@if docker volume inspect game_app_prod_frontend_node_modules >/dev/null 2>&1; then \
		echo "💿Removing game_app_prod_frontend_node_modules..."; \
		docker volume rm game_app_prod_frontend_node_modules; \
	else \
		echo "Volume game_app_prod_frontend_node_modules does not exist."; \
	fi


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
	@echo ""
	@echo "Default:"
	@echo "  make              → Build, start, and SEED the environment"
	@echo "  make all          → Build, start, and SEED the environment"
	@echo ""
	@echo "Run:"
	@echo "  make prod         → Build and start environment (NO seeding)"
	@echo "  make prod-seed    → Build, start, and seed environment"
	@echo ""
	@echo "Database:"
	@echo "  make seed-prod    → Seed database manually"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean        → Stop containers"
	@echo "  make fclean       → Full cleanup"
	@echo ""
