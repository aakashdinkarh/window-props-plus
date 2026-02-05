/**
 * Creates a zip file of the dist folder for Chrome Web Store upload
 */
import { createWriteStream, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

const distDir = resolve(rootDir, 'dist');
const outputPath = resolve(rootDir, 'window-props-plus.zip');

if (!existsSync(distDir)) {
    console.error('❌ dist/ folder not found. Run "npm run build" first.');
    process.exit(1);
}

const output = createWriteStream(outputPath);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
    const sizeKB = (archive.pointer() / 1024).toFixed(2);
    console.log(`✅ Created ${outputPath} (${sizeKB} KB)`);
});

archive.on('error', (err) => {
    throw err;
});

archive.pipe(output);
archive.directory(distDir, false);
archive.finalize();
