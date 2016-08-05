import pkg from 'alpastor/package.json';

const ID = 'alpastor';

// TODO: add options
const options = {
};

function generate(cst, code) {
  return new Promise((resolve, reject) => {
    require.ensure(['alpastor'], require => {
      try {
        const generatorModule = require('alpastor');
        const generate = generatorModule.generate || generatorModule;

        resolve(generate(cst).code);
      } catch(ex) {
        reject(ex);
      }
    });
  });
}

export default {
  id: ID,
  language: 'javascript',
  displayName: ID,
  version: pkg.version,
  homepage: pkg.homepage,
  generate,
};
