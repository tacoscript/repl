import babel from './babel';
import tacotruck from './tacotruck';
import alpastor from './alpastor';

export let generators = [
  babel,
  tacotruck,
  alpastor,
];
for (let i = 0, len = generators.length; i < len; i++) {
  let generator = generators[i];
  if (generator.language == null) generator.language = 'javascript';
}

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
  return tacotruck;
}
