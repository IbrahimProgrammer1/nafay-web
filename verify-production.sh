#!/bin/bash

# Production Verification Script
# Run this before deploying to Vercel

echo "🔍 PRODUCTION VERIFICATION SCRIPT"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check 1: Build
echo "📦 Step 1: Building for production..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

# Check 2: Environment Variables
echo ""
echo "🔐 Step 2: Checking environment variables..."
if [ -f .env.local ]; then
    echo -e "${GREEN}✅ .env.local exists${NC}"

    # Check required variables
    required_vars=("DATABASE_URL" "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME" "CLOUDINARY_API_KEY" "ADMIN_PASSWORD_HASH")
    for var in "${required_vars[@]}"; do
        if grep -q "^${var}=" .env.local; then
            echo -e "${GREEN}  ✅ ${var} configured${NC}"
        else
            echo -e "${RED}  ❌ ${var} missing${NC}"
        fi
    done
else
    echo -e "${RED}❌ .env.local not found${NC}"
fi

# Check 3: Vercel Configuration
echo ""
echo "⚙️  Step 3: Checking Vercel configuration..."
if [ -f vercel.json ]; then
    echo -e "${GREEN}✅ vercel.json exists${NC}"
else
    echo -e "${RED}❌ vercel.json missing${NC}"
fi

if [ -f .vercelignore ]; then
    echo -e "${GREEN}✅ .vercelignore exists${NC}"
else
    echo -e "${YELLOW}⚠️  .vercelignore missing (optional)${NC}"
fi

# Check 4: Documentation
echo ""
echo "📚 Step 4: Checking documentation..."
docs=("DEPLOYMENT_GUIDE.md" "PRODUCTION_READINESS_REPORT.md" "QUICK_DEPLOY.md")
for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        echo -e "${GREEN}✅ ${doc} exists${NC}"
    else
        echo -e "${YELLOW}⚠️  ${doc} missing${NC}"
    fi
done

# Check 5: Git Status
echo ""
echo "📝 Step 5: Checking Git status..."
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Git repository initialized${NC}"

    # Check for uncommitted changes
    if [[ -z $(git status -s) ]]; then
        echo -e "${GREEN}✅ No uncommitted changes${NC}"
    else
        echo -e "${YELLOW}⚠️  You have uncommitted changes${NC}"
        echo "   Run: git add . && git commit -m 'Production ready'"
    fi
else
    echo -e "${YELLOW}⚠️  Not a Git repository${NC}"
fi

# Check 6: Dependencies
echo ""
echo "📦 Step 6: Checking dependencies..."
if [ -d node_modules ]; then
    echo -e "${GREEN}✅ node_modules exists${NC}"
else
    echo -e "${RED}❌ node_modules missing - run npm install${NC}"
fi

# Check 7: Next.js Version
echo ""
echo "🔧 Step 7: Checking Next.js version..."
NEXT_VERSION=$(npm list next --depth=0 2>/dev/null | grep next@ | sed 's/.*next@//')
if [ ! -z "$NEXT_VERSION" ]; then
    echo -e "${GREEN}✅ Next.js version: ${NEXT_VERSION}${NC}"
else
    echo -e "${RED}❌ Could not determine Next.js version${NC}"
fi

# Final Summary
echo ""
echo "=================================="
echo "📊 VERIFICATION SUMMARY"
echo "=================================="
echo ""
echo "Your project is ready for Vercel deployment if all checks passed."
echo ""
echo "Next steps:"
echo "1. Push to GitHub: git push origin main"
echo "2. Go to: https://vercel.com/new"
echo "3. Import your repository"
echo "4. Add environment variables"
echo "5. Deploy!"
echo ""
echo "📖 For detailed instructions, see:"
echo "   - QUICK_DEPLOY.md (fast deployment)"
echo "   - DEPLOYMENT_GUIDE.md (detailed guide)"
echo ""
echo "🎉 Good luck with your deployment!"
