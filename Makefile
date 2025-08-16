# Flashcard App Deployment Makefile
# Mondrian-inspired Angular flashcard app with Firebase backend

.PHONY: help dev build deploy clean all

# Default target
help:
	@echo "🎨 Flashcard App Deployment Commands"
	@echo "=================================="
	@echo ""
	@echo "📋 Available commands:"
	@echo "  make dev     - Start development server"
	@echo "  make build   - Build for production"
	@echo "  make deploy  - Full deployment to GitHub Pages"
	@echo "  make clean   - Clean build artifacts"
	@echo "  make all     - Build and deploy in one step"
	@echo ""
	@echo "🚀 Deployment target:"
	@echo "  - Custom domain: https://jialin00.com/duopandas/"
	@echo "  - GitHub Pages: https://jialinhuangblog.github.io/duopandas/"
	@echo ""
	@echo "🔧 What happens during deployment:"
	@echo "  1. Build Angular app with base-href=/duopandas/"
	@echo "  2. Copy index.html to 404.html (SPA routing fix)"
	@echo "  3. Deploy to gh-pages branch using gh-pages tool"

# Start development server
dev:
	@echo "🚀 Starting development server..."
	ng serve

# Build for production
build:
	@echo "🏗️  Building for production..."
	@echo "   - Setting base-href to /duopandas/ for GitHub Pages"
	@echo "   - Bundling and optimizing Angular app"
	ng build --base-href="/duopandas/"
	@echo "✅ Build complete in dist/flashcard-app/"

# Deploy to GitHub Pages
deploy: build
	@echo "📄 Copying index.html to 404.html..."
	@echo "   Why? GitHub Pages needs 404.html for Angular SPA routing"
	@echo "   When user visits /duopandas/admin directly:"
	@echo "   - GitHub looks for /admin/index.html (doesn't exist)"
	@echo "   - Serves 404.html instead (contains full Angular app)"
	@echo "   - Angular router handles the /admin route"
	@echo ""
	@echo "🚀 Deploying to GitHub Pages..."
	@echo "   - Target repo: git@blog.github.com:jialinhuangblog/duopandas.git"
	@echo "   - Branch: gh-pages"
	@echo "   - Source: dist/flashcard-app/browser/"
	npm run deploy
	@echo ""
	@echo "✅ Deployment complete!"
	@echo "🌐 Visit: https://jialin00.com/duopandas/"

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf dist/
	@echo "✅ Clean complete"

# Build and deploy in one step
all: deploy

# Show deployment status
status:
	@echo "📊 Deployment Status"
	@echo "==================="
	@echo "Build artifacts: $(shell ls -la dist/ 2>/dev/null | wc -l || echo 0) files"
	@echo "Git remote: $(shell git remote get-url origin)"
	@echo "Current branch: $(shell git branch --show-current)"
	@echo "Last commit: $(shell git log -1 --oneline)"