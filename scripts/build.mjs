#!/usr/bin/env node
/**
 * scripts/build.mjs
 *
 * Build pipeline for the personal-web-resume static site.
 *
 * Currently handles:
 *   - Generating responsive profile images (AVIF + WebP from erico.jpg)
 *
 * Future steps (planned):
 *   - Render index.html and id/index.html from resume.json + Mustache templates
 *   - Generate sitemap.xml dynamically
 *   - Optimize OG image
 *
 * Usage:
 *   node scripts/build.mjs              # full build
 *   node scripts/build.mjs --images-only
 */

import sharp from 'sharp';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const args = new Set(process.argv.slice(2));
const imagesOnly = args.has('--images-only');

// ---------------------------------------------------------------------------
// Image optimization
// ---------------------------------------------------------------------------

/**
 * Generate AVIF + WebP variants of the profile photo.
 * Sources are kept in-place; outputs sit next to the source.
 */
async function buildImages() {
    const targets = [
        {
            source: resolve(ROOT, 'assets/img/erico.jpg'),
            outputs: [
                { ext: 'avif', options: { quality: 60, effort: 6 } },
                { ext: 'webp', options: { quality: 80, effort: 6 } },
            ],
            // Resize cap — keeps profile photo sharp on retina up to 400px display size
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

    await buildImages();

    if (imagesOnly) {
        console.log(`\n✓ images-only build done in ${Date.now() - t0}ms`);
        return;
    }

    // Future steps go here:
    //   - HTML rendering from resume.json
    //   - sitemap.xml generation
    //   - asset hashing

    console.log(`\n✓ build done in ${Date.now() - t0}ms`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
