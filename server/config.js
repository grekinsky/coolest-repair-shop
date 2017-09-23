const defaults = {
  host: 'localhost',
  port: process.env.PORT || 3000,
  devTool: 'source-map',
  minified: false,
  devServer: false,
};

const applyDefaults = obj => Object.assign({}, defaults, obj);
const environment = {
  local: applyDefaults({
    // local config
    host: 'localhost',
    port: 3000,
    devTool: 'inline-source-map',
    minified: false,
    devServer: true,
    appEnv: 'production', // TODO: Set to development when environment is properly setup
  }),
  development: applyDefaults({
    // development config
    devTool: 'source-map',
    minified: false,
    devserver: false,
    appEnv: 'production', // TODO: Set to development when environment is properly setup
  }),
  production: applyDefaults({
    // production config
    devTool: false,
    minified: true,
    devServer: false,
    appEnv: 'production',
  }),
};

module.exports = env => environment[env] || defaults;
