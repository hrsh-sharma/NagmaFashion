const fs = require('fs');
const path = require('path');

const dir = 'd:/personal/nagmafashion/src';

const replacements = [
  // Colors (for style.scss and similar files)
  { regex: /--theme-color:\s*#[A-Fa-f0-9]{6};/g, replace: '--theme-color: #AD8746;' },
  { regex: /--theme-color-secondary:\s*#1A1A1A;/g, replace: '--theme-color-secondary: #0D3754;' },

  // Brand Name
  { regex: /Nagma Fashion/g, replace: 'Gaonvashi' },
  { regex: /nagmafashion\.com/g, replace: 'gaonvashi.com' },
  { regex: /nagmafashion\.in/g, replace: 'gaonvashi.in' },
  { regex: /NagmaFashion/g, replace: 'Gaonvashi' },
  { regex: /nagmafashion/g, replace: 'gaonvashi' },
  { regex: /Nagma fashion/g, replace: 'Gaonvashi' },
  { regex: /Nagma\sFashion/gi, replace: 'Gaonvashi' },
  
  // Logo
  { regex: /nagma-logo\.png/g, replace: 'gaovasi_logo.png' }
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
console.log('Global rename and logo replace done.');
