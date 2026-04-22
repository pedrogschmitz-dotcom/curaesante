export interface BlogPost {
  title: string;
  slug: string;
  autor: string;
  data: string;
  resumo: string;
  imagem: string;
  imagem_alt: string;
  tags: string[];
  published: boolean;
  body: string;
}

function normalizeImagePath(path: string): string {
  if (!path) return "";
  if (/^(https?:)?\/\//i.test(path) || path.startsWith("data:")) return path;
  if (path.startsWith("/")) return `${import.meta.env.BASE_URL}${path.slice(1)}`;
  return path;
}

function parseFrontmatter(raw: string): { attributes: Record<string, unknown>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { attributes: {}, body: raw };

  const yamlBlock = match[1];
  const body = match[2];
  const attributes: Record<string, unknown> = {};

  for (const line of yamlBlock.split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value: string | boolean | string[] = line.slice(colonIndex + 1).trim();

    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Parse booleans
    if (value === 'true') { attributes[key] = true; continue; }
    if (value === 'false') { attributes[key] = false; continue; }

    // Parse arrays like ["tag1", "tag2"]
    if (value.startsWith('[') && value.endsWith(']')) {
      const inner = value.slice(1, -1);
      attributes[key] = inner.split(',').map(s => {
        s = s.trim();
        if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
          s = s.slice(1, -1);
        }
        return s;
      });
      continue;
    }

    attributes[key] = value;
  }

  return { attributes, body };
}

function rawToPost(raw: string): BlogPost | null {
  const { attributes, body } = parseFrontmatter(raw);
  if (!attributes.title || !attributes.slug) return null;

  return {
    title: String(attributes.title),
    slug: String(attributes.slug),
    autor: String(attributes.autor ?? ''),
    data: String(attributes.data ?? ''),
    resumo: String(attributes.resumo ?? ''),
    imagem: normalizeImagePath(String(attributes.imagem ?? '')),
    imagem_alt: String(attributes.imagem_alt ?? ''),
    tags: Array.isArray(attributes.tags) ? attributes.tags : [],
    published: attributes.published === true,
    body: body.trim(),
  };
}

// Eagerly import all .md files from content/blog/
const modules = import.meta.glob('/content/blog/*.md', { eager: true, query: '?raw', import: 'default' });

function getAllPosts(): BlogPost[] {
  const posts: BlogPost[] = [];
  for (const path in modules) {
    const raw = modules[path] as string;
    const post = rawToPost(raw);
    if (post) posts.push(post);
  }
  return posts;
}

export function getPublishedPosts(): BlogPost[] {
  return getAllPosts()
    .filter(p => p.published)
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const all = getAllPosts();
  const post = all.find(p => p.slug === slug) ?? null;
  if (post && !post.published) return null;
  return post;
}

export function formatDatePtBR(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}
