const fs = require('fs');
const path = require('path');

const directory = './src';
const searchStr = '<div className="overflow-x-auto rounded-lg border border-border">';
const replacementStr = '<div className="overflow-hidden rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm shadow-sm transition-all duration-300">\\n          <div className="overflow-x-auto">';

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
  if (content.includes(searchStr)) {
    // First we replace the opening div
    let updated = content.replace(searchStr, replacementStr.replace(/\\n/g, '\n'));
    
    // Then we need to add the closing div after </table>
    // Since we know the structure is typically </table> followed by spaces and </div>
    updated = updated.replace(/<\/table>\s*<\/div>/g, '</table>\n          </div>\n        </div>');
    
    fs.writeFileSync(file, updated, 'utf8');
    console.log(`Updated tables in: ${file}`);
  }
});
