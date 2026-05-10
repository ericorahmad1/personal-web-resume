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
import { existsSync, statSync, writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const args = new Set(process.argv.slice(2));
const imagesOnly = args.has('--images-only');
const iconsOnly = args.has('--icons-only');
const ogOnly = args.has('--og-only');

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
    { id: 'sun', registry: 'lucide', slug: 'sun' },
    { id: 'moon', registry: 'lucide', slug: 'moon' },
    { id: 'chevron-left', registry: 'lucide', slug: 'chevron-left' },
    { id: 'chevron-right', registry: 'lucide', slug: 'chevron-right' },
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
// Open Graph card image (1200x630 branded social share)
// ---------------------------------------------------------------------------

/**
 * Render an SVG describing the OG card, then rasterize via sharp to PNG.
 * The profile photo is embedded as a base64 data URL so the SVG is self-contained.
 */
async function buildOgImage() {
    console.log('\n🖼️  Building OG card image (1200x630)');

    const photoPath = resolve(ROOT, 'assets/img/erico.jpg');
    if (!existsSync(photoPath)) {
        console.warn('   ⚠ profile photo missing, skip OG card');
        return;
    }

    // Pre-process the photo to a tidy 320x320 circle-ready PNG, then base64 it
    const photoBuf = await sharp(photoPath)
        .resize(320, 320, { fit: 'cover', position: 'center' })
        .png()
        .toBuffer();
    const photoDataUrl = `data:image/png;base64,${photoBuf.toString('base64')}`;

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
    <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#bd5d38"/>
            <stop offset="100%" stop-color="#8a4128"/>
        </linearGradient>
        <clipPath id="circle">
            <circle cx="950" cy="315" r="170"/>
        </clipPath>
        <filter id="ds" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.25"/>
        </filter>
    </defs>

    <!-- Background -->
    <rect width="1200" height="630" fill="url(#bg)"/>

    <!-- Subtle pattern: angled stripes top-right -->
    <g opacity="0.08" fill="#ffffff">
        <polygon points="900,0 1200,0 1200,300"/>
        <polygon points="1100,0 1200,0 1200,100"/>
    </g>

    <!-- Left: name + role -->
    <g font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fill="#ffffff">
        <text x="80" y="220" font-size="32" font-weight="500" opacity="0.85" letter-spacing="3">QA / SECURITY ENGINEER</text>
        <text x="80" y="320" font-size="76" font-weight="800" letter-spacing="-1">Erico Rahmad</text>
        <text x="80" y="400" font-size="76" font-weight="800" letter-spacing="-1">Darmanto</text>

        <line x1="80" y1="440" x2="180" y2="440" stroke="#ffffff" stroke-width="4" opacity="0.7"/>

        <text x="80" y="495" font-size="28" font-weight="500" opacity="0.85">Penetration Testing &#8226; Cypress &#8226; Selenium &#8226; OWASP</text>
        <text x="80" y="555" font-size="24" font-weight="400" opacity="0.7">Denpasar, Bali &#8212; ericorahmad1.github.io/personal-web-resume</text>
    </g>

    <!-- Right: circular profile photo with white ring -->
    <g filter="url(#ds)">
        <circle cx="950" cy="315" r="180" fill="#ffffff"/>
        <image href="${photoDataUrl}" x="780" y="145" width="340" height="340" clip-path="url(#circle)" preserveAspectRatio="xMidYMid slice"/>
    </g>
</svg>`;

    const outPath = resolve(ROOT, 'assets/img/og-image.png');
    await sharp(Buffer.from(svg)).png({ quality: 90, compressionLevel: 9 }).toFile(outPath);

    const bytes = statSync(outPath).size;
    console.log(`   → assets/img/og-image.png (${humanBytes(bytes)})`);
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

    if (ogOnly) {
        await buildOgImage();
    } else {
        if (!iconsOnly) await buildImages();
        if (!imagesOnly) await buildIconSprite();
        if (!iconsOnly && !imagesOnly) await buildOgImage();
    }

    console.log(`\n✓ build done in ${Date.now() - t0}ms`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
