import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.resolve(__dirname, 'dist');
const indexPath = path.resolve(distPath, 'index.html');

const routes = [
  'explore',
  'explore/ui',
  'explore/cli',
];

if (!fs.existsSync(indexPath)) {
  console.error('Error: dist/index.html not found! Run vite build first.');
  process.exit(1);
}

const indexContent = fs.readFileSync(indexPath, 'utf-8');

routes.forEach((route) => {
  const targetDir = path.resolve(distPath, route);
  
  // Create recursive directories
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  const targetIndex = path.resolve(targetDir, 'index.html');
  fs.writeFileSync(targetIndex, indexContent, 'utf-8');
  console.log(`Successfully generated static route index: ${path.relative(distPath, targetIndex)}`);
});

console.log('Postbuild static routing generation completed successfully!');
