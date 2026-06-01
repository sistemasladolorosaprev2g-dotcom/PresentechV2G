const fs = require('fs');
const path = require('path');

const directory = './src';
const searchRegex = /border border-border bg-card/g;
const replacement = 'rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm shadow-sm transition-all duration-300';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) { 
      results.push(file);
    }
  });
  return results;
}

const files = walk(directory);
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (searchRegex.test(content)) {
    const updated = content.replace(searchRegex, replacement);
    fs.writeFileSync(file, updated, 'utf8');
    console.log(`Updated: ${file}`);
  }
});
