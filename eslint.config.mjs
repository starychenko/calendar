import nextConfig from "eslint-config-next";

/** @type {import("eslint").Linter.Config[]} */
const config = [
  ...nextConfig,
  {
    rules: {
      // Ukrainian text naturally contains " and ' characters
      "react/no-unescaped-entities": "off",
    },
  },
];

export default config;
