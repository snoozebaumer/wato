import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs", globals: globals.node}},
  { languageOptions:
        {
          globals:
              {
                describe: "readonly",
                it: "readonly",
                afterEach: "readonly"
              }
        }
  },
  pluginJs.configs.recommended,
  { ignores: [
      "node_modules/",
      "dist/",
    ],

  }
];