import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://curaesante.com.br';
const BLOG_DIR = path.resolve('content/blog');
const OUT = path.resolve('public/sitemap.xml');

const staticRoutes = ['/', '/sobre', '/servicos', '/equipe', '/blog', '/faq', '/metabolismo-feminino', '/contato'];

function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const attrs: Record<string, unknown> = {};
  for (const line of match[1].split('\n')) {
    const i = line.indexOf(':');
    if (i === -1) continue;
    let val: string | boolean = line.slice(i + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
      val = val.slice(1, -1);
    if (val === 'true') { attrs[line.slice(0, i).trim()] = true; continue; }
    if (val === 'false') { attrs[line.slice(0, i).trim()] = false; continue; }
    attrs[line.slice(0, i).trim()] = val;
  }
  return attrs;
}

const today = new Date().toISOString().split('T')[0];

let urls = staticRoutes.map(r => `  <url>
    <loc>${BASE_URL}${r}</loc>
    <lastmod>${today}</lastmod>
  </url>`);

if (fs.existsSync(BLOG_DIR)) {
  for (const file of fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'))) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
    const fm = parseFrontmatter(raw);
    if (fm.published !== true) continue;
    const slug = fm.slug as string;
    const data = fm.data as string;
    const lastmod = data ? data.split('T')[0] : today;
    urls.push(`  <url>
    <loc>${BASE_URL}/blog/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`);
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

fs.writeFileSync(OUT, sitemap, 'utf-8');
console.log(`Sitemap generated: ${OUT}`);
