#!/usr/bin/env node

/**
 * CSS Performance Optimization Script
 * - Identifies duplicate selectors
 * - Suggests consolidation opportunities
 * - Reports animation usage
 */

const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/app/globals.css');
const css = fs.readFileSync(cssPath, 'utf8');

console.log('🔍 Analyzing CSS file...\n');

// Count lines
const lines = css.split('\n').length;
console.log(`📊 Total lines: ${lines}`);

// Count selectors
const selectorMatches = css.match(/^[^{]+{/gm) || [];
console.log(`📊 Total selectors: ${selectorMatches.length}`);

// Count animations
const animationMatches = css.match(/@keyframes\s+[\w-]+/g) || [];
console.log(`📊 Total @keyframes: ${animationMatches.length}`);
console.log('   Animations:', animationMatches.map(a => a.replace('@keyframes ', '')).join(', '));

// Count media queries
const mediaMatches = css.match(/@media[^{]+{/g) || [];
console.log(`📊 Total @media queries: ${mediaMatches.length}`);

// Find potential duplicates (same selector appearing multiple times)
const selectorCounts = {};
selectorMatches.forEach(sel => {
  const clean = sel.trim();
  selectorCounts[clean] = (selectorCounts[clean] || 0) + 1;
});

const duplicates = Object.entries(selectorCounts).filter(([_, count]) => count > 1);
if (duplicates.length > 0) {
  console.log(`\n⚠️  Potential duplicate selectors (${duplicates.length}):`);
  duplicates.slice(0, 10).forEach(([sel, count]) => {
    console.log(`   ${count}x: ${sel.substring(0, 60)}...`);
  });
}

// Calculate file size
const sizeKB = (Buffer.byteLength(css, 'utf8') / 1024).toFixed(2);
console.log(`\n📦 File size: ${sizeKB} KB`);

// Estimate gzipped size (rough approximation)
const estimatedGzipKB = (sizeKB * 0.25).toFixed(2);
console.log(`📦 Estimated gzipped: ~${estimatedGzipKB} KB`);

console.log('\n✅ Analysis complete!');
console.log('\n💡 Optimization suggestions:');
console.log('   1. Consolidate duplicate selectors');
console.log('   2. Use CSS custom properties for repeated values');
console.log('   3. Consider splitting into multiple files for code splitting');
console.log('   4. Minimize animation complexity for better performance');
