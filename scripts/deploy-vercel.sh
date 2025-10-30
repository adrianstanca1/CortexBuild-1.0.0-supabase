#!/bin/bash

# ==========================================
# CortexBuild Vercel Deployment Script
# ==========================================

set -e

echo "🚀 Starting CortexBuild Vercel deployment..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Build the project
echo -e "${GREEN}Building project...${NC}"
npm run build

# Deploy to Vercel
echo -e "${GREEN}Deploying to Vercel...${NC}"
vercel --prod --yes

echo -e "${GREEN}✅ Deployment complete!${NC}"

