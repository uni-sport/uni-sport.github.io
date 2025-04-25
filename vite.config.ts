import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import Pages from "vite-plugin-pages";
import fs from "node:fs";
import matter from "gray-matter";

export default defineConfig({
  base: "/",
  plugins: [
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: [remarkFrontmatter],
        providerImportSource: "@mdx-js/react",
      }),
    },
    Pages({
      extensions: ["tsx", "mdx"],
      extendRoute(route) {
        const path = `./${route.element}`;
        const content = fs.readFileSync(path, "utf-8");
        const { data } = matter(content);
        return { meta: data };
      },
    }),
    tailwindcss(),
    react(),
  ],
});
