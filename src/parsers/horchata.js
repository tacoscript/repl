import React from 'react';
import defaultParserInterface from './utils/defaultESTreeParserInterface';
import pkg from 'horchata/package.json';
import * as LocalStorage from '../LocalStorage';
import SettingsRenderer from './utils/SettingsRenderer';

const ID = 'babylon6';
const plugins = [
  // TODO
];
const options = Object.assign(
  {
    sourceType: 'module',
    allowReturnOutsideFunction: false,
    allowSuperOutsideMethod: false,
    allowNewTargetOutsideFunction: false,

    // sourceElements: true,

    // locations: true,
    // ranges: false,
    // createParenthesizedExpressionNodes: false,
    allowImportExportEverywhere: false,
    noTopLevelDirectives: false,
    plugins: plugins.slice(0),
  },
  LocalStorage.getParserSettings(ID)
);

export default {
  ...defaultParserInterface,

  id: ID,
  displayName: ID,
  version: pkg.version,
  homepage: pkg.homepage,

  parse(code) {
    return new Promise((resolve, reject) => {
      require.ensure(['horchata'], require => {
        try {
          const horchata = require('horchata');
          resolve(horchata.parse(code, options));
        } catch(err) {
          reject(err);
        }
      });
    });
  },

  getNodeName(node) {
    switch (typeof node.type) {
      case 'string':
        return node.type;
      case 'object':
        return `Token (${node.type.key})`;
    }
  },

  nodeToRange(node) {
    if (typeof node.start !== 'undefined') {
      return [node.start, node.end];
    }
  },

  renderSettings() {
    return Settings();
  },
};

let parserSettings = [
  ['sourceType', ['module', 'script']],
  'allowReturnOutsideFunction',
  'allowImportExportEverywhere',
  'allowSuperOutsideMethod',
  'allowNewTargetOutsideFunction',
  'noTopLevelDirectives',
];

function changeOption(name, {target}) {
  if (name === 'sourceType') {
    options.sourceType = target.vaue;
  } else if (parserSettings.indexOf(name) > -1) {
    options[name] = target.checked;
  } else if (plugins.indexOf(name) > -1) {
    let plugs = new Set(options.plugins);
    if (target.checked) {
      plugs.add(name);
    } else {
      plugs.delete(name);
    }
    options.plugins = Array.from(plugs);
  }
  LocalStorage.setParserSettings(ID, options);
}

function Settings() {
  return (
    <div>
      {SettingsRenderer({
        settings: parserSettings,
        values: options,
        onChange: changeOption,
      })}
      <h4>plugins</h4>
      {SettingsRenderer({
        settings: plugins,
        values: plugins.reduce(
          (obj, p) => ((obj[p] = options.plugins.indexOf(p) > -1), obj),
          {}
        ),
        onChange: changeOption,
      })}
    </div>
  );
}
