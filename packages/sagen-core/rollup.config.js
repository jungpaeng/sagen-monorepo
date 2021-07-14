import path from "path";
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { terser } from "rollup-plugin-terser";

const createBabelConfig = require("./babel.config");

const { root } = path.parse(process.cwd());
const extensions = [".js", ".ts"];

function external(id) {
  return !id.startsWith(".") && !id.startsWith(root);
}

function createPluginConfig(targets) {
  const config = createBabelConfig({ env: (env) => env === "build" }, targets);

  if (targets.ie) {
    config.plugins = [
      ...config.plugins,
      "@babel/plugin-transform-regenerator",
      ["@babel/plugin-transform-runtime", { helpers: true, regenerator: true }],
    ];
    config.babelHelpers = "runtime";
  }

  return [
    peerDepsExternal(),
    resolve({ extensions }),
    typescript({ useTsconfigDeclarationDir: true }),
    babel({ ...config, extensions }),
    terser(),
  ];
}

export default [
  {
    external,
    input: "src/index.ts",
    output: { file: "lib/index.esm.js", format: "esm" },
    plugins: createPluginConfig({ node: 8 }),
  },
  {
    external,
    input: "src/index.ts",
    preserveModules: true,
    output: { dir: "lib", format: "cjs", exports: "named" },
    plugins: createPluginConfig({ ie: 11 }),
  },
];
