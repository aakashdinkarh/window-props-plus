import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, readdirSync, statSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { transformSync } from 'esbuild';

/**
 * Minify CSS by removing comments, extra whitespace, and unnecessary characters
 */
function minifyCss(css) {
    return css
        // Remove CSS comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove whitespace around selectors and braces
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*,\s*/g, ',')
        // Remove last semicolon before closing brace
        .replace(/;}/g, '}')
        // Collapse multiple spaces
        .replace(/\s{2,}/g, ' ')
        // Remove newlines
        .replace(/\n/g, '')
        .trim();
}

/**
 * Inline CSS files into HTML, replacing <link> tags with <style> tags
 */
function inlineCss(html, baseDir) {
    // Match all stylesheet link tags
    const linkRegex = /<link\s+href=["']([^"']+)["']\s+rel=["']stylesheet["']\s*\/?>/g;

    return html.replace(linkRegex, (match, href) => {
        const cssPath = resolve(baseDir, href);

        if (existsSync(cssPath)) {
            const cssContent = readFileSync(cssPath, 'utf-8');
            const minifiedCss = minifyCss(cssContent);
            return `<style>${minifiedCss}</style>`;
        }

        // If file doesn't exist, keep original link tag
        console.warn(`⚠️ CSS file not found: ${cssPath}`);
        return match;
    });
}

/**
 * Minify HTML by removing comments, extra whitespace, and unnecessary characters
 */
function minifyHtml(html) {
    return html
        // Remove HTML comments (but keep IE conditional comments if any)
        .replace(/<!--(?!\[if)[\s\S]*?-->/g, '')
        // Remove whitespace between tags
        .replace(/>\s+</g, '><')
        // Remove leading/trailing whitespace from lines
        .replace(/^\s+|\s+$/gm, '')
        // Collapse multiple spaces into one
        .replace(/\s{2,}/g, ' ')
        // Remove newlines
        .replace(/\n/g, '')
        // Clean up spaces around attributes
        .replace(/\s+>/g, '>')
        .replace(/\s+\/>/g, '/>')
        .trim();
}

/**
 * Minify JavaScript using esbuild
 */
function minifyJs(code) {
    const result = transformSync(code, {
        minify: true,
        target: 'es2020',
    });
    return result.code;
}

/**
 * Read, minify, and write a JavaScript file
 */
function minifyJsFile(srcPath, destPath) {
    const code = readFileSync(srcPath, 'utf-8');
    const minified = minifyJs(code);
    writeFileSync(destPath, minified);
}

/**
 * Recursively copy a directory
 */
function copyDir(src, dest) {
    mkdirSync(dest, { recursive: true });
    const entries = readdirSync(src);

    for (const entry of entries) {
        const srcPath = resolve(src, entry);
        const destPath = resolve(dest, entry);

        if (statSync(srcPath).isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            copyFileSync(srcPath, destPath);
        }
    }
}

/**
 * Plugin to copy static assets to dist folder
 */
function copyStaticAssets() {
    return {
        name: 'copy-static-assets',
        writeBundle() {
            const distDir = resolve(__dirname, 'dist');

            // Minify and copy manifest.json
            const manifest = readFileSync(resolve(__dirname, 'manifest.json'), 'utf-8');
            const minifiedManifest = JSON.stringify(JSON.parse(manifest));
            writeFileSync(resolve(distDir, 'manifest.json'), minifiedManifest);

            // Copy images
            const imagesDir = resolve(__dirname, 'images');
            if (existsSync(imagesDir)) {
                copyDir(imagesDir, resolve(distDir, 'images'));
            }

            // Process index.html: inline CSS, update script path, minify
            let indexHtml = readFileSync(resolve(__dirname, 'index.html'), 'utf-8');

            // Inline and minify CSS (preserves order of link tags)
            indexHtml = inlineCss(indexHtml, __dirname);

            // Update script path to bundled version
            indexHtml = indexHtml.replace(
                'src="scripts/onPageLoad.js"',
                'src="scripts/popup.js"'
            );

            // Minify final HTML
            const minifiedHtml = minifyHtml(indexHtml);
            writeFileSync(resolve(distDir, 'index.html'), minifiedHtml);

            // Minify and copy content scripts
            const contentScriptsDir = resolve(distDir, 'scripts/contentScripts');
            mkdirSync(contentScriptsDir, { recursive: true });
            minifyJsFile(
                resolve(__dirname, 'scripts/contentScripts/attachDataToWindow.js'),
                resolve(contentScriptsDir, 'attachDataToWindow.js')
            );

            // Minify and copy service worker
            const serviceWorkerDir = resolve(distDir, 'scripts/serviceWorker');
            mkdirSync(serviceWorkerDir, { recursive: true });
            minifyJsFile(
                resolve(__dirname, 'scripts/serviceWorker/background.js'),
                resolve(serviceWorkerDir, 'background.js')
            );

            // Copy Ace Editor files
            const aceEditorSrcDir = resolve(__dirname, 'scripts/aceEditor');
            const aceEditorDestDir = resolve(distDir, 'scripts/aceEditor');
            if (existsSync(aceEditorSrcDir)) {
                copyDir(aceEditorSrcDir, aceEditorDestDir);
            }

            console.log('✅ Static assets copied to dist/');
        }
    };
}

export default defineConfig({
    build: {
        outDir: 'dist',
        emptyDirBeforeWrite: true,
        sourcemap: process.env.NODE_ENV === 'development',
        minify: process.env.NODE_ENV === 'production',
        rollupOptions: {
            input: {
                popup: resolve(__dirname, 'scripts/onPageLoad.js'),
            },
            output: {
                entryFileNames: 'scripts/[name].js',
                chunkFileNames: 'scripts/[name].js',
                assetFileNames: '[name].[ext]',
            },
        },
    },
    plugins: [copyStaticAssets()],
});
