#!/usr/bin/env node

/**
 * Copy brand assets to dist directory (cross-platform)
 * Works on Windows, macOS, and Linux
 */

const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'brand');
const targetDir = path.join(__dirname, '..', 'dist', 'brand');

function copyDirRecursively(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read source directory
  const files = fs.readdirSync(src);

  files.forEach((file) => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyDirRecursively(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

try {
  if (!fs.existsSync(sourceDir)) {
    console.error(`Error: Source directory not found: ${sourceDir}`);
    process.exit(1);
  }

  copyDirRecursively(sourceDir, targetDir);
  console.log(`✓ Brand assets copied from ${sourceDir} to ${targetDir}`);
} catch (error) {
  console.error(`Error copying brand assets: ${error.message}`);
  process.exit(1);
}
