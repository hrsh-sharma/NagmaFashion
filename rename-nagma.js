const fs = require('fs');
const path = require('path');

const dir = 'd:/personal/nagmafashion/src';

const replacements = [
  { regex: /\bNagma\b/g, replace: 'Gaonvashi' },
  { regex: /\bNAGMA\b/g, replace: 'GAONVASHI' }
];

function walk(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (stat.isFile() && /\.(ts|html|scss|json)$/.test(file)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const { regex, replace } of replacements) {
        if (regex.test(content)) {
          content = content.replace(regex, replace);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

walk(dir);
console.log('Global Nagma replace done.');
