import { defineConfig } from "tsup";

export default defineConfig({
  target: "es2020",
  format: ["cjs", "esm"],
  outDir: "lib",
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
});
