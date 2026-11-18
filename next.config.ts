import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The site has no server code, so `next build` writes a plain static site to `out/`.
  // It is hosted as a Render Static Site (see render.yaml) and served locally by scripts/serve-static.mjs.
  // (cacheComponents / partial prerendering are not compatible with a static export and are not needed here.)
  output: "export",
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
