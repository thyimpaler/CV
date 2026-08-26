import path from "path"
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// Explicit .ts extension: this file is checked under moduleResolution
// "nodenext", which requires one, and `allowImportingTsExtensions` is already
// on for exactly this case. esbuild resolves it when it bundles the config.
import { projects } from './src/data/cv.ts'

const SITE = "https://www.thyimpaler.xyz"

/**
 * Emit robots.txt and sitemap.xml at build time.
 *
 * Both were missing, and missing here is worse than it sounds: `vercel.json`
 * rewrites everything that is not a real file to `/index.html`, so a crawler
 * asking for `/robots.txt` was handed the site's HTML with a 200. Nothing had
 * ever pointed at the ten `/work/<slug>` pages, so their only route into the
 * index was the links on the home page.
 *
 * Generated from `projects` rather than checked in by hand, so adding a
 * project cannot leave the sitemap a commit behind — the failure mode of a
 * static sitemap is that it is silently wrong, which is the failure mode you
 * least want in a file only robots read.
 */
function seoFiles(): Plugin {
  return {
    name: "seo-files",
    apply: "build",
    generateBundle() {
      const urls = [`${SITE}/`, ...projects.map((p) => `${SITE}/work/${p.slug}`)]
      const today = new Date().toISOString().slice(0, 10)

      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: [
          "User-agent: *",
          "Allow: /",
          "",
          `Sitemap: ${SITE}/sitemap.xml`,
          "",
        ].join("\n"),
      })

      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source:
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          urls
            .map(
              (loc, i) =>
                `  <url>\n` +
                `    <loc>${loc}</loc>\n` +
                `    <lastmod>${today}</lastmod>\n` +
                // The CV itself is the page that matters; the project pages
                // are supporting material, and saying so is the only thing
                // priority is good for.
                `    <priority>${i === 0 ? "1.0" : "0.7"}</priority>\n` +
                `  </url>`,
            )
            .join("\n") +
          `\n</urlset>\n`,
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), seoFiles()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // bind to 0.0.0.0 so localhost, 127.0.0.1 and LAN all work
    port: 5173,
  },
})
