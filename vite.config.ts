import { resolve } from "node:path"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(import.meta.dirname, "src/index.ts"),
        vue: resolve(import.meta.dirname, "src/vue.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        entryFileNames: "[name].js",
      },
    },
    sourcemap: true,
  },
  plugins: [
    dts({
      entryRoot: "src",
      include: ["src"],
      exclude: ["src/test"],
      rollupTypes: false,
    }),
  ],
})
