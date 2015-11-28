import pkg from 'tacoscript-generator/package.json';

const ID = 'tacoscript';

// TODO: add options
const options = {
  format: {
    preserve: false,
  },
};

function generate(ast, code) {
  return new Promise((resolve, reject) => {
    require.ensure(['tacoscript-generator'], require => {
      try {
        const generatorModule = require('tacoscript-generator');
        const generate = generatorModule.default || generatorModule;

        resolve(
            generate(
              ast,
              {
                ...options,
              },
              code,
            ).code
        );
      } catch(ex) {
        reject(ex);
      }
    });
  });
}

export default {
  id: ID,
  displayName: ID,
  version: pkg.version,
  homepage: pkg.homepage,
  generate,
};
