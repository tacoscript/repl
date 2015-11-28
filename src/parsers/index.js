// import acorn from './acorn';
// import babelEslint from './babel-eslint';
// import babylon from './babylon';
import babylon6 from './babylon6';
// import espree from './espree';
// import esprima from './esprima';
import horchata from './horchata';
// import recast from './recast';
// import shift from './shift';
// import traceur from './traceur';
// import typescript from './typescript';
// import uglify from './uglify';

export var parsers = [
  // acorn,
  // babelEslint,
  // babylon,
  babylon6,
  // espree,
  // esprima,
  horchata,
  // recast,
  // shift,
  // traceur,
  // typescript,
  // uglify,
];

for (let i = 0, len = parsers.length; i < len; i++) {
  let parser = parsers[i];
  if (parser.language == null) parser.language = 'javascript';
}

export function getDefaultParser() {
  return babylon6;
}

export function getDefaultLeftParser() {
  return horchata;
}

let byID = parsers.reduce(
  (map, parser) => {
    map[parser.id] = parser;
    return map;
  },
  {}
);

export function getParserByID(id) {
  return byID[id];
}

export function getParser(idOrObject) {
  let parserID = idOrObject && typeof idOrObject === 'object' ?
    idOrObject.id :
    idOrObject;
  return parserID ? getParserByID(parserID) : null;
}
