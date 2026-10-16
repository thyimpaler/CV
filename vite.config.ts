import fs from "fs"
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

/**
 * Ship the CV page as `cv.html` rather than `index.html`.
 *
 * Vercel checks the filesystem before it applies `rewrites`, and `/` matches
 * `index.html` as a directory index. So with an `index.html` in the output, a
 * request for mod.thyimpaler.xyz/ was answered with the CV before the
 * host-based rewrite in vercel.json ever ran. With no root index, `/` is not a
 * file: the mod host rewrites to `/mod/index.html` and every other host falls
 * through to the catch-all, which now points at `/cv.html`.
 *
 * Renamed after the bundle is written so dev (which serves the source
 * index.html) is untouched. `vite preview` has no `/` as a result; open
 * /cv.html there.
 */
function mainPageAsCv(): Plugin {
  let outDir = "dist"
  return {
    name: "main-page-as-cv",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    writeBundle() {
      const from = path.join(outDir, "index.html")
      if (fs.existsSync(from)) fs.renameSync(from, path.join(outDir, "cv.html"))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), seoFiles(), mainPageAsCv()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Two pages from one build. `mod/` is the community and moderation page,
    // served at mod.thyimpaler.xyz by a host rewrite in vercel.json. Sharing
    // the build keeps one copy of the tokens and components, and the page
    // only pulls in the few components it imports.
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        mod: path.resolve(__dirname, "mod/index.html"),
      },
    },
  },
  server: {
    host: true, // bind to 0.0.0.0 so localhost, 127.0.0.1 and LAN all work
    port: 5173,
  },
})
