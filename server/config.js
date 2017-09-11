const defaults = {
  host: 'localhost',
  port: process.env.PORT || 5000,
  devTool: 'source-map',
  minified: false,
  devServer: false,
};

const applyDefaults = obj => Object.assign({}, defaults, obj);
const environment = {
  local: applyDefaults({
    // local config
    host: 'localhost',
    port: 5000,
    devTool: 'inline-source-map',
    minified: false,
    devServer: true,
  }),
  development: applyDefaults({
    // development config
    devTool: 'source-map',
    minified: false,
    devserver: false,
  }),
  production: applyDefaults({
    // production config
    devTool: false,
    minified: true,
    devServer: false,
  }),
};

module.exports = env => environment[env] || defaults;
