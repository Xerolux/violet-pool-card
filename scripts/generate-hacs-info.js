import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readmePath = path.join(__dirname, '..', 'README.md');
const infoPath = path.join(__dirname, '..', 'info.md');

try {
  let readme = fs.readFileSync(readmePath, 'utf-8');

  // Remove HTML elements like <div align="center">
  readme = readme.replace(/<div[^>]*>/g, '');
  readme = readme.replace(/<\/div>/g, '');
  readme = readme.replace(/<br\s*\/?>/g, '');

  // Remove markdown badges
  readme = readme.replace(/\[!\[.*?\]\[.*?\]\]\[.*?\]\n?/g, '');
  readme = readme.replace(/\[!\[.*?\]\(.*?\)\]\(.*?\)\n?/g, '');
  readme = readme.replace(/<!--.*?-->/gs, '');

  // Remove multiple empty lines created by removing badges and HTML
  readme = readme.replace(/\n{3,}/g, '\n\n');

  fs.writeFileSync(infoPath, readme);
  console.log(`Successfully generated info.md for HACS from README.md`);
} catch (error) {
  console.error(`Error generating info.md: ${error.message}`);
  process.exit(1);
}
