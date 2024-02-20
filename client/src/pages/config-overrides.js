const { override, fallback } = require('customize-cra');

module.exports = override(
  fallback({
    buffer: require.resolve("buffer/")
  })
);
