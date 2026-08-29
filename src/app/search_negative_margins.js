const fs = require('fs');

const cssPath = 'd:/xampp/htdocs/twin-project-3-new/frontend/src/app/style.css';
const content = fs.readFileSync(cssPath, 'utf8');

const regex = /[^{}]*\{[^{}]*\}/g;
const blocks = content.match(regex) || [];
const matching = blocks.filter(b => b.includes('margin-top') && b.includes('-'));

console.log(`Found ${matching.length} matching blocks with negative margin-top:`);
matching.forEach((b, i) => {
  console.log(`\nMatch ${i+1}:`);
  console.log(b);
});
