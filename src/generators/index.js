import babel from './babel';
import tacoscript from './tacoscript';

export let generators = [
  babel,
  tacoscript,
];

let byID = generators.reduce(
  (map, tool) => {
    map[tool.id] = tool;
    return map;
  },
  {}
);

export function getGeneratorByID(id) {
  return byID[id];
}

export function getDefaultGenerator() {
  return babel;
}

export function getDefaultLeftGenerator() {
  return tacoscript;
}
