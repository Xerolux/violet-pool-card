const fs = require('fs');
const content = fs.readFileSync('dist/violet-pool-card.js', 'utf8');
const lines = content.split('\n');
const match = lines.find(line => line.includes("window.customCards.push"));
const idx = match.indexOf("window.customCards.push({type:\"violet-pool-card\"");
console.log(match.substring(idx - 250, idx + 100));
