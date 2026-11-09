#!/usr/bin/env bash
# ==============================================================================
# UTSAVO - One-Click Git Commit & Push Utility
# Repository: https://github.com/kirannetpack-ui/utsavo.git
# ==============================================================================

set -e

# 1. Resolve safe directory permission for current container environment
git config --global --add safe.directory /app/applet 2>/dev/null || true
git config --global user.name "Kiran Sharma" 2>/dev/null || true
git config --global user.email "kiran67311@gmail.com" 2>/dev/null || true
git config --global init.defaultBranch main 2>/dev/null || true

# 2. Extract GitHub Token from parameter or environment variable
TOKEN="${1:-$GITHUB_TOKEN}"

if [ -z "$TOKEN" ]; then
  echo ""
  echo "================================================================================"
  echo "  UTSAVO GIT PUSH UTILITY"
  echo "================================================================================"
  echo ""
  echo "  GitHub requires a Personal Access Token (PAT) for command-line pushes."
  echo ""
  echo "  HOW TO USE (Simplest method):"
  echo "    bash push_to_github.sh YOUR_GITHUB_TOKEN"
  echo ""
  echo "  Or set the environment variable and run:"
  echo "    export GITHUB_TOKEN=ghp_your_token_here"
  echo "    bash push_to_github.sh"
  echo ""
  echo "  HOW TO GET A GITHUB TOKEN (Takes 60 seconds):"
  echo "    1. Go to: https://github.com/settings/tokens"
  echo "    2. Click 'Generate new token' -> 'Generate new token (classic)'"
  echo "    3. Note: 'Utsavo Deploy Token'"
  echo "    4. Check the box for: [x] repo (Full control of private repositories)"
  echo "    5. Click 'Generate token' and copy the token (starts with ghp_...)"
  echo "================================================================================"
  echo ""
  exit 1
fi

echo "📦 1. Staging all modified and newly created files..."
git add -A

# Check if there are changes to commit
if git diff --staged --quiet; then
  echo "ℹ️  Working tree clean (no new uncommitted file changes)."
else
  COMMIT_MSG="${2:-"feat: Update Utsavo celebration marketplace and destination Nepal hub $(date '+%Y-%m-%d %H:%M')"}"
  echo "💾 2. Committing changes: '$COMMIT_MSG'..."
  git commit -m "$COMMIT_MSG"
fi

echo "🚀 3. Pushing branch 'main' to https://github.com/kirannetpack-ui/utsavo.git..."

# Temporarily push using the authenticated URL without permanently writing token to disk
git push "https://${TOKEN}@github.com/kirannetpack-ui/utsavo.git" main

echo ""
echo "================================================================================"
echo "  ✅ SUCCESS: All UTSAVO code has been pushed to GitHub!"
echo "  Repository: https://github.com/kirannetpack-ui/utsavo"
echo "  Branch:     main"
echo "================================================================================"
echo ""
