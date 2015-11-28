import pkg from 'babel-generator/package.json';

const ID = 'babel';

// TODO: add options
const options = {
  compact: false,
  retainLines: false,
};

function generate(ast, code) {
  return new Promise((resolve, reject) => {
    require.ensure(['babel-generator'], require => {
      try {
        const generatorModule = require('babel-generator');
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
