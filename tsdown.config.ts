import type { UserConfig } from "tsdown";

export default {
  format: ["cjs", "esm"],
  outDir: "lib",
  minify: false,
  sourcemap: false,
  nodeProtocol: "strip",
  inlineOnly: false,
} satisfies UserConfig;
