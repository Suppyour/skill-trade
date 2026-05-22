.PHONY: help install build build-frontend build-backend dev dev-frontend dev-backend db-migrate

# Default target
help:
	@echo "======================================================================"
	@echo "                  SkillSwap Monorepo Developer Console                "
	@echo "======================================================================"
	@echo "Available commands:"
	@echo "  make install         - Install all frontend NPM dependencies"
	@echo "  make build           - Build both Frontend and C# Backend"
	@echo "  make build-frontend  - Build Vite Frontend static assets"
	@echo "  make build-backend   - Compile .NET Clean Architecture Backend"
	@echo "  make dev-frontend    - Launch local Vite React dev server"
	@echo "  make dev-backend     - Launch local ASP.NET Web API server"
	@echo "  make db-migrate      - Apply database EF migrations (PostGIS)"
	@echo "======================================================================"

install:
	@echo "Installing Frontend dependencies..."
	cd Frontend && npm install

build-frontend:
	@echo "Building Frontend..."
	cd Frontend && npm run build

build-backend:
	@echo "Compiling Backend..."
	dotnet build Backend/Backend.sln

build: build-frontend build-backend
	@echo "Full monorepo build completed successfully!"

dev-frontend:
	@echo "Starting React Frontend on http://localhost:5173..."
	cd Frontend && npm run dev

dev-backend:
	@echo "Starting ASP.NET API on http://localhost:5107..."
	cd Backend/src/SkillSwap.Api && dotnet run

db-migrate:
	@echo "Updating database to latest schema via EF Core..."
	cd Backend/src/SkillSwap.Api && dotnet ef database update
