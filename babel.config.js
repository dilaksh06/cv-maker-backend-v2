// backend/babel.config.js
// This file must use ES Module syntax (export default) because your project is "type": "module"

export default {
  presets: [
    "@babel/preset-react",
    ["@babel/preset-env", {
      targets: {
        node: "current",
      },
    }],
  ],
  // You typically don't need 'plugins' here unless you have specific Babel plugins.
  // And avoid 'only' or 'ignore' here if your babel-loader.js is handling it.
};