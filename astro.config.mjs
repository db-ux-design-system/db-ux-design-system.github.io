// @ts-check
import { defineConfig } from "astro/config";
import { appConfig } from "./app.config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { filterSitemapBlacklist } from "./template/integrations/sitemap";
import orama from "@orama/plugin-astro";

// https://astro.build/config
export default defineConfig({
  site: appConfig.hostname,
  base: appConfig.basePath,
  integrations: [
    react({}),
    mdx(),
    sitemap({
      filter: filterSitemapBlacklist,
    }),
    orama({
      pages: {
        pathMatcher: /\/.+\//,
        language: "english",
      },
    }),
  ],
  srcDir: "./content",
  outDir: "./public",
  publicDir: "./static",
  vite: {
    ssr: {
      noExternal: ["@db-ux/react-core-components"],
    },
    resolve: {
      alias: {
        '@components': new URL('./template/components', import.meta.url).pathname,
        '@template': new URL('./template', import.meta.url).pathname,
        '@content': new URL('./content', import.meta.url).pathname,
        '@config': new URL('./app.config.ts', import.meta.url).pathname,
      },
    },
  },
  devToolbar: {
    enabled: false,
  },
  build: {
    inlineStylesheets: "always",
  },
});
