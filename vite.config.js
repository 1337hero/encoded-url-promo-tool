import react from "@vitejs/plugin-react";
import autoprefixer from 'autoprefixer';
import path from "path";
import tailwindcss from 'tailwindcss';
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    devSourcemap: true,
    sourcemap: true,
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ],
      sourceMap: true,
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3001,
    sourcemap: 'inline'
},
  build: {
    minify: true,
    rollupOptions: {
      output: {
        chunkFileNames: "js/[name]-[hash].js", // Naming pattern for JS chunks
        entryFileNames: "js/[name]-[hash].js", // Naming pattern for JS entry files
        assetFileNames: ({ name }) => {
          // output path for different types of assets
          if (/\.(gif|jpe?g|png|svg)$/.test(name ?? "")) {
            return "img/[name][extname]";
          }
          if (/\.css$/.test(name ?? "")) {
            return "css/styles-[hash][extname]";
          }
          if (/\.(woff2?|eot|ttf|otf)$/.test(name ?? "")) {
            return "fonts/[name][extname]";
          }
          if (/\.html$/.test(name ?? "")) {
            return "[name].html";
          }
          // Default output path for other assets
          return "[name]-[hash][extname]";
        },
      },
    },
  },
});
