const defaults = {
  port: process.env.PORT || 5000,
};

const applyDefaults = obj => Object.assign({}, defaults, obj);

const environment = {
  localhost: applyDefaults({
    port: 5000,
  }),
  production: applyDefaults({
    // minify: true, // TODO: when webpack's ready
  }),
};

module.exports = env => environment[env] || defaults;
