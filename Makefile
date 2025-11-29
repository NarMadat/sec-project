.PHONY: help setup start stop clean logs test

help:
	@echo "Security Management Platform - Development Commands"
	@echo ""
	@echo "Available commands:"
	@echo "  setup     - Initial project setup"
	@echo "  start     - Start all services"
	@echo "  stop      - Stop all services"
	@echo "  clean     - Clean up containers and volumes"
	@echo "  logs      - View logs"
	@echo "  test      - Run tests"

setup:
	chmod +x scripts/setup.sh
	./scripts/setup.sh

start:
	chmod +x scripts/start-dev.sh
	./scripts/start-dev.sh

stop:
	docker-compose down

clean:
	docker-compose down -v --remove-orphans
	docker system prune -f

logs:
	docker-compose logs -f

test:
	pnpm run test

dev-auth:
	pnpm --filter auth-service run start:dev

dev-employee:
	pnpm --filter employee-service run start:dev

dev-object:
	pnpm --filter object-service run start:dev

dev-shift:
	pnpm --filter shift-service run start:dev

dev-gateway:
	pnpm --filter gateway-service run start:dev
