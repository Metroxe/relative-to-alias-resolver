import * as esbuild from "esbuild";
import * as fs from "node:fs";

const buildOptions = {
  platform: "node",
  bundle: true,
  sourcemap: true,
  metafile: true,
  target: ["es2020"],
};

// bundles for imports
await esbuild.build({
  ...buildOptions,
  entryPoints: ["src/index.ts", "src/cli.ts"],
  format: "esm",
  splitting: true,
  outdir: "dist/esm",
});

await esbuild.build({
  ...buildOptions,
  entryPoints: ["src/index.ts"],
  format: "cjs",
  outfile: "dist/cjs/index.cjs",
});

await esbuild.build({
  ...buildOptions,
  entryPoints: ["src/cli.ts"],
  format: "cjs",
  outfile: "dist/cjs/cli.cjs",
});
