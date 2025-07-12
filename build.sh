#!/bin/bash

set -e

# Build script for Lexington LSP binary for Zed extension

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXTENSION_DIR="$SCRIPT_DIR"
LEXINGTON_DIR="$SCRIPT_DIR/../lexington"
BIN_DIR="$EXTENSION_DIR/bin"

echo "Building Lexington LSP binary for Zed extension..."

# Create bin directory if it doesn't exist
mkdir -p "$BIN_DIR"

# Build the LSP binary
echo "Building LSP server..."
cd "$LEXINGTON_DIR"

# Detect OS and architecture
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

case $ARCH in
    x86_64) ARCH="amd64" ;;
    arm64|aarch64) ARCH="arm64" ;;
    *) echo "Unsupported architecture: $ARCH" && exit 1 ;;
esac

# Set binary name based on OS
BINARY_NAME="lexington"
if [ "$OS" = "windows" ]; then
    BINARY_NAME="lexington.exe"
fi

# Build with version information
VERSION=$(git describe --tags --always --dirty 2>/dev/null || echo "dev")
COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo "Building for $OS/$ARCH..."
echo "Version: $VERSION"
echo "Commit: $COMMIT"
echo "Date: $DATE"

# Build the main lexington binary with LSP support
CGO_ENABLED=0 GOOS="$OS" GOARCH="$ARCH" go build \
    -ldflags="-s -w -X main.version=$VERSION -X main.commit=$COMMIT -X main.date=$DATE" \
    -o "$BIN_DIR/$BINARY_NAME" \
    .

echo "Built: $BIN_DIR/$BINARY_NAME"

# Also build standalone LSP binary
CGO_ENABLED=0 GOOS="$OS" GOARCH="$ARCH" go build \
    -ldflags="-s -w -X main.version=$VERSION -X main.commit=$COMMIT -X main.date=$DATE" \
    -o "$BIN_DIR/lexington-lsp${BINARY_NAME#lexington}" \
    ./cmd/lsp

echo "Built: $BIN_DIR/lexington-lsp${BINARY_NAME#lexington}"

# Make binaries executable (if not Windows)
if [ "$OS" != "windows" ]; then
    chmod +x "$BIN_DIR"/*
fi

# Test the LSP binary
echo "Testing LSP binary..."
if "$BIN_DIR/$BINARY_NAME" --version >/dev/null 2>&1; then
    echo "✓ Main binary working"
else
    echo "✗ Main binary test failed"
    exit 1
fi

if "$BIN_DIR/lexington-lsp${BINARY_NAME#lexington}" --version >/dev/null 2>&1; then
    echo "✓ LSP binary working"
else
    echo "✗ LSP binary test failed"
    exit 1
fi

echo ""
echo "Build complete! Binaries available in: $BIN_DIR"
echo "- $BINARY_NAME (main binary with --lsp flag)"
echo "- lexington-lsp${BINARY_NAME#lexington} (standalone LSP server)"
echo ""
echo "Extension ready for packaging!"
