.PHONY: help install dev-api build-api start-api dev-server build-server start-server dev-worker build-worker start-worker dev-all build-all start-all lint lint-fix format typecheck db-generate db-migrate db-push db-pull db-studio db-drop db-seed db-clickhouse-migrate db-clickhouse-status fresh reset

# Default target
help:
	@echo "Available commands:"
	@echo ""
	@echo "  Setup:"
	@echo "    install             - Install dependencies"
	@echo ""
	@echo "  Development:"
	@echo "    dev-api             - Start API development server with hot reload"
	@echo "    dev-server          - Start SERVER development server with hot reload"
	@echo "    dev-worker          - Start WORKER development with hot reload"
	@echo "    dev-all             - Run server and worker in dev mode concurrently"
	@echo ""
	@echo "  Build:"
	@echo "    build-api           - Build the API application"
	@echo "    build-server        - Build the SERVER application"
	@echo "    build-worker        - Build the WORKER application"
	@echo "    build-all           - Build server and worker concurrently"
	@echo ""
	@echo "  Production:"
	@echo "    start-api           - Start the API production server"
	@echo "    start-server        - Start the SERVER production server"
	@echo "    start-worker        - Start the WORKER production service"
	@echo "    start-all           - Run server and worker in production concurrently"
	@echo ""
	@echo "  Code Quality:"
	@echo "    lint                - Run ESLint"
	@echo "    lint-fix            - Fix ESLint issues"
	@echo "    format              - Format code with Prettier"
	@echo "    typecheck           - Run TypeScript type checking"
	@echo ""
	@echo "  Database (PostgreSQL/Drizzle):"
	@echo "    db-generate         - Generate migration files"
	@echo "    db-migrate          - Run pending migrations"
	@echo "    db-push             - Push schema to database (dev only)"
	@echo "    db-pull             - Pull schema from database"
	@echo "    db-studio           - Open Drizzle Studio"
	@echo "    db-drop             - Drop all tables (dangerous!)"
	@echo "    db-seed             - Seed database with initial data"
	@echo ""
	@echo "  Database (ClickHouse):"
	@echo "    db-clickhouse-migrate - Run ClickHouse migrations"
	@echo "    db-clickhouse-status  - Check ClickHouse migration status"
	@echo ""
	@echo "  Workflows:"
	@echo "    fresh               - Drop, push schema, and seed (dev only)"
	@echo "    reset               - Generate, migrate, and seed"

install:
	bun install

# Development commands
dev-api:
	bun run dev:api

build-api:
	bun run build:api

start-api:
	bun run start:api

dev-server:
	bun run dev:server

build-server:
	bun run build:server

start-server:
	bun run start:server

dev-worker:
	bun run dev:worker

build-worker:
	bun run build:worker

start-worker:
	bun run start:worker

dev-all:
	bun run dev:all

build-all:
	bun run build:all

start-all:
	bun run start:all

# Code quality
lint:
	bun run lint

lint-fix:
	bun run lint:fix

format:
	bun run format

typecheck:
	bun run typecheck

# Database (PostgreSQL/Drizzle)
db-generate:
	bun run db:generate

db-migrate:
	bun run db:migrate

db-push:
	bun run db:push

db-pull:
	bun run db:pull

db-studio:
	bun run db:studio

db-drop:
	bun run db:drop

db-seed:
	bun run db:seed

# Database (ClickHouse)
db-clickhouse-migrate:
	bun run db:clickhouse:migrate

db-clickhouse-status:
	bun run db:clickhouse:status

# Combined workflows
fresh: db-drop db-push db-seed
	@echo "Database refreshed and seeded!"

reset: db-generate db-migrate db-seed
	@echo "Database migrated and seeded!"