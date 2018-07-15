import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import babel from "rollup-plugin-babel";
import pkg from "./package.json";

export default [
  // browser-friendly UMD build
  {
    input: "src/main.ts",
    output: {
      name: "abacus",
      file: pkg.browser,
      format: "umd"
    },
    plugins: [
      babel({
        exclude: "node_modules/**",
        presets: [["@babel/preset-env", { modules: false }], "@babel/preset-typescript"]
      }),
      json(),
      resolve(), // so Rollup can find `ms`
      commonjs() // so Rollup can convert `ms` to an ES module
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: "src/main.ts",
    external: ["ms"],
    plugins: [
      babel({
        exclude: "node_modules/**",
        presets: [["@babel/preset-env", { modules: false }], "@babel/preset-typescript"]
      })
    ],
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" }
    ]
  }
];
