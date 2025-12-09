/**
 * Script para arreglar imports
 * Ejecutar: node fix-imports.js
 */

const fs = require('fs');
const path = require('path');

const replacements = [
  { from: 'from "../api"', to: 'from "@services/api"' },
  { from: 'from "../context/', to: 'from "@context/' },
  { from: 'from "../components/', to: 'from "@components/' },
  { from: 'from "../utils/', to: 'from "@utils/' },
  { from: 'from "../pages/', to: 'from "@pages/' },
];

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  replacements.forEach(({ from, to }) => {
    if (content.includes(from)) {
      content = content.replaceAll(from, to);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      fixFile(filePath);
    }
  });
}

console.log('🔧 Arreglando imports...\n');
walkDir('./src');
console.log('\n✅ ¡Todos los imports arreglados!');