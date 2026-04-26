import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import prerender from "@prerenderer/rollup-plugin";
import { readdirSync, readFileSync } from "fs";

// Descobre rotas de posts publicados em content/blog/*.md
function getBlogRoutes(): string[] {
  try {
    const dir = path.resolve(__dirname, "content/blog");
    return readdirSync(dir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => readFileSync(path.join(dir, f), "utf-8"))
      .map((raw) => {
        const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        if (!fm) return null;
        const block = fm[1];
        const slug = /\bslug:\s*"?([^"\n\r]+)"?/.exec(block)?.[1]?.trim();
        const published = /\bpublished:\s*(true|false)/.exec(block)?.[1] === "true";
        return published && slug ? `/blog/${slug}` : null;
      })
      .filter((s): s is string => Boolean(s));
  } catch {
    return [];
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "production" &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prerender as any)({
        routes: ["/", "/sobre", "/servicos", "/equipe", "/blog", "/contato", ...getBlogRoutes()],
        renderer: "@prerenderer/renderer-puppeteer",
        rendererOptions: {
          // Mais resiliente que evento para evitar timeout em CI
          renderAfterTime: 1200,
          maxConcurrentRoutes: 2,
        },
      }),
  ].filter(Boolean) as any,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
