import pkg from 'tacotruck/package.json';

const ID = 'tacotruck';

// TODO: add options
const options = {
  format: {
    preserve: false,
  },
};

function generate(ast, code) {
  return new Promise((resolve, reject) => {
    require.ensure(['tacotruck'], require => {
      try {
        const generatorModule = require('tacotruck');
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
  language: 'tacoscript',
  displayName: ID,
  version: pkg.version,
  homepage: pkg.homepage,
  generate,
};
