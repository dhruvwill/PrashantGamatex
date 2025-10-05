#!/usr/bin/env bash

# This script runs before npm install on EAS Build
# It ensures that platform-specific native modules are properly installed

set -e

echo "🔧 Pre-install hook: Preparing for native module installation..."

# Clean any existing lightningcss installation to prevent platform conflicts
if [ -d "node_modules/lightningcss" ]; then
  echo "Removing existing lightningcss to ensure Linux binary is installed..."
  rm -rf node_modules/lightningcss
fi

echo "✅ Pre-install hook complete"

