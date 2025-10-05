#!/usr/bin/env bash

# This script runs after npm install on EAS Build
# It verifies native modules and runs any necessary post-install steps

set -e

echo "🔧 Post-install hook: Verifying native modules..."

# Check if lightningcss is installed
if [ -d "node_modules/lightningcss" ]; then
  # Check if the Linux binary exists
  if [ ! -f "node_modules/lightningcss/lightningcss.linux-x64-gnu.node" ]; then
    echo "⚠️  lightningcss Linux binary not found. Reinstalling with --force..."
    npm install lightningcss@latest --force --no-save --legacy-peer-deps
  else
    echo "✅ lightningcss Linux binary found"
  fi
else
  echo "⚠️  lightningcss not installed. Installing..."
  npm install lightningcss@latest --force --no-save --legacy-peer-deps
fi

echo "✅ Post-install hook complete"

