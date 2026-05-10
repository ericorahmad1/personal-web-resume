#!/usr/bin/env node
/**
 * scripts/build.mjs
 *
 * Build pipeline for the personal-web-resume static site.
 *
 * Currently handles:
 *   - Generating responsive profile images (AVIF + WebP from erico.jpg)
 *   - Building a local SVG icon sprite from Simple Icons (brand) + Lucide (UI),
 *     replacing the Font Awesome CDN runtime
 *
 * Future steps (planned):
 *   - Render index.html and id/index.html from resume.json + Mustache templates
 *   - Generate sitemap.xml dynamically
 *   - Optimize OG image
 *
 * Usage:
 *   node scripts/build.mjs              # full build
 *   node scripts/build.mjs --images-only
 *   node scripts/build.mjs --icons-only
 */

import sharp from 'sharp';
import { existsSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const args = new Set(process.argv.slice(2));
const imagesOnly = args.has('--images-only');
const iconsOnly = args.has('--icons-only');

// ---------------------------------------------------------------------------
// Image optimization
// ---------------------------------------------------------------------------

async function buildImages() {
    const targets = [
        {
            source: resolve(ROOT, 'assets/img/erico.jpg'),
            outputs: [
                { ext: 'avif', options: { quality: 60, effort: 6 } },
                { ext: 'webp', options: { quality: 80, effort: 6 } },
            ],
            width: 800,
        },
    ];

    for (const target of targets) {
        if (!existsSync(target.source)) {
            console.warn(`  ⚠ skip: ${target.source} (not found)`);
            continue;
        }

        const sourceBytes = statSync(target.source).size;
        console.log(`\n📷 ${target.source.replace(ROOT, '.')} (${humanBytes(sourceBytes)})`);

        for (const { ext, options } of target.outputs) {
            const out = target.source.replace(/\.(jpg|jpeg|png)$/i, `.${ext}`);
            const pipeline = sharp(target.source).resize({ width: target.width, withoutEnlargement: true });

            if (ext === 'avif') await pipeline.avif(options).toFile(out);
            else if (ext === 'webp') await pipeline.webp(options).toFile(out);

            const outBytes = statSync(out).size;
            const ratio = ((1 - outBytes / sourceBytes) * 100).toFixed(0);
            console.log(`   ↳ ${ext.padEnd(4)} ${humanBytes(outBytes).padStart(8)}  (${ratio}% smaller)`);
        }
    }
}

// ---------------------------------------------------------------------------
// SVG icon sprite
// ---------------------------------------------------------------------------

/**
 * Each entry: id (used in <use href="#icon-ID">), source registry, source slug.
 *
 * Registries:
 *   simpleicons : https://cdn.simpleicons.org/<slug>/000000
 *                 (brand icons; viewBox 0 0 24 24)
 *   lucide      : https://unpkg.com/lucide-static@latest/icons/<slug>.svg
 *                 (UI/glyph icons; viewBox 0 0 24 24)
 */
const ICONS = [
    // Brand
    // LinkedIn was removed from Simple Icons over trademark; fall back to Lucide
    { id: 'linkedin', registry: 'lucide', slug: 'linkedin' },
    { id: 'github', registry: 'simpleicons', slug: 'github' },
    { id: 'twitter', registry: 'simpleicons', slug: 'x' },
    { id: 'instagram', registry: 'simpleicons', slug: 'instagram' },
    { id: 'tiktok', registry: 'simpleicons', slug: 'tiktok' },
    { id: 'javascript', registry: 'simpleicons', slug: 'javascript' },
    { id: 'python', registry: 'simpleicons', slug: 'python' },
    { id: 'java', registry: 'simpleicons', slug: 'openjdk' },
    { id: 'html5', registry: 'simpleicons', slug: 'html5' },
    { id: 'css3', registry: 'simpleicons', slug: 'css' },
    { id: 'nodejs', registry: 'simpleicons', slug: 'nodedotjs' },
    { id: 'linux', registry: 'simpleicons', slug: 'linux' },
    { id: 'git', registry: 'simpleicons', slug: 'git' },
    { id: 'gitlab', registry: 'simpleicons', slug: 'gitlab' },
    { id: 'jira', registry: 'simpleicons', slug: 'jira' },
    { id: 'npm', registry: 'simpleicons', slug: 'npm' },

    // UI
    { id: 'check', registry: 'lucide', slug: 'check' },
    { id: 'link', registry: 'lucide', slug: 'link' },
    { id: 'vial', registry: 'lucide', slug: 'flask-conical' },
    { id: 'clipboard-check', registry: 'lucide', slug: 'clipboard-check' },
    { id: 'shield', registry: 'lucide', slug: 'shield' },
    { id: 'database', registry: 'lucide', slug: 'database' },
    { id: 'terminal', registry: 'lucide', slug: 'terminal' },
    { id: 'bug', registry: 'lucide', slug: 'bug' },
    { id: 'certificate', registry: 'lucide', slug: 'award' },
    { id: 'trophy', registry: 'lucide', slug: 'trophy' },
];

function urlFor({ registry, slug }) {
    if (registry === 'simpleicons') return `https://cdn.simpleicons.org/${slug}/currentColor`;
    if (registry === 'lucide') return `https://unpkg.com/lucide-static@latest/icons/${slug}.svg`;
    throw new Error(`unknown registry: ${registry}`);
}

/** Strip outer <svg ...> wrapper from a fetched SVG and return its inner XML + viewBox. */
function unwrapSvg(svgText) {
    const viewBoxMatch = svgText.match(/viewBox=["']([^"']+)["']/);
    const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';

    // Drop the <?xml ...?> and <!DOCTYPE> lines plus the outer <svg> tag
    const inner = svgText
        .replace(/<\?xml[\s\S]*?\?>/g, '')
        .replace(/<!DOCTYPE[\s\S]*?>/g, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<svg[\s\S]*?>/, '')
        .replace(/<\/svg>\s*$/, '')
        .trim();

    return { inner, viewBox };
}

async function buildIconSprite() {
    console.log('\n🔣 Building SVG icon sprite');
    const symbols = [];

    for (const icon of ICONS) {
        const url = urlFor(icon);
        const res = await fetch(url);
        if (!res.ok) {
            console.warn(`   ✗ ${icon.id.padEnd(20)} ${res.status} ${url}`);
            continue;
        }
        const svgText = await res.text();
        const { inner, viewBox } = unwrapSvg(svgText);
        symbols.push(`    <symbol id="icon-${icon.id}" viewBox="${viewBox}">${inner}</symbol>`);
        console.log(`   ✓ ${icon.id.padEnd(20)} (${icon.registry}/${icon.slug})`);
    }

    const sprite =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">\n` +
        symbols.join('\n') +
        `\n</svg>\n`;

    const outDir = resolve(ROOT, 'assets');
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
    const outPath = resolve(outDir, 'icons.svg');
    writeFileSync(outPath, sprite, 'utf8');

    const bytes = statSync(outPath).size;
    console.log(`   → assets/icons.svg (${humanBytes(bytes)}, ${ICONS.length} icons)`);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function humanBytes(n) {
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
    const t0 = Date.now();
    console.log('🔨 personal-web-resume build');

    if (!iconsOnly) await buildImages();
    if (!imagesOnly) await buildIconSprite();

    console.log(`\n✓ build done in ${Date.now() - t0}ms`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
