const fs = require('fs');
const path = require('path');

const cssPath = 'd:/xampp/htdocs/twin-project-3-new/frontend/src/app/style.css';
const content = fs.readFileSync(cssPath, 'utf8');

// Find all matches for "flight" or "banner" or "hero"
const regex = /[^{}]*\{[^{}]*\}/g;
const blocks = content.match(regex) || [];
const matching = blocks.filter(b => b.toLowerCase().includes('flight') || b.toLowerCase().includes('banner') || b.toLowerCase().includes('hero') || b.toLowerCase().includes('container'));

console.log(`Found ${matching.length} matching blocks:`);
matching.forEach((b, i) => {
  console.log(`\nMatch ${i+1}:`);
  console.log(b);
});
