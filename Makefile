# Configuration
COMPOSE_BASE = Docker/docker-compose.yml
COMPOSE_PROD = ./docker-compose.prod.yml
COMPOSE_LOCALPROD = ./docker-compose.localprod.yml

# Container names (optional; for clarity)
PROJECT_NAME = game_app

# Default target
.DEFAULT_GOAL := help

# ==============================================================================
# 🧩 Build Targets
# ==============================================================================

build-prod:
	@echo "🏗️  Building production images..."
	docker compose -p $(PROJECT_NAME)_prod -f $(COMPOSE_PROD) build

build-local-prod:
	@echo "🏗️  Building production images..."
	docker compose -p $(PROJECT_NAME)_prod -f $(COMPOSE_LOCALPROD) build

# ==============================================================================
# 🌱 Database Seeding
# ==============================================================================

seed-prod:
	@echo "🌱 Seeding database (prod)..."
	docker compose -p $(PROJECT_NAME)_prod \
		-f $(COMPOSE_LOCALPROD) \
		exec backend npm run seed:prod


# ==============================================================================
# 🚀 Run Targets
# ==============================================================================

prod: build-prod
	@echo "🌐 Starting production environment..."
	docker compose -p $(PROJECT_NAME)_prod -f $(COMPOSE_PROD) up -d


# ==============================================================================
# 🌱 Bootstrap (build + run + seed)
# ==============================================================================

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
	make build-prod

# ==============================================================================
# 📘 Help
# ==============================================================================

help:
	@echo "  make prod         → Run production environment"
	@echo "  make prod-seed    → Build, run, and seed production environment"
	@echo "  make build-prod   → Build prod Docker images"
	@echo "  make seed-prod    → Seed prod database"
	@echo "  make clean        → Stop and remove containers"
	@echo "  make fclean       → Full cleanup"
	@echo "  make re           → Rebuild everything"
