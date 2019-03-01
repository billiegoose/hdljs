function compileJsCall (chip, mapping) {
  let fntext = '';
  fntext += `;[${chip.outputNames().map(local => mapping[local]).join(', ')}] = `
  fntext += `${chip.name}(${chip.inputNames().map(local => mapping[local]).join(', ')});`
  return fntext;
}

export function compileChip (chip) {
  let fntext = ''
  fntext += `function ${chip.name} (${chip.inputNames().join(', ')}) {\n`
  fntext += `  let ${[...chip.internalNames(), ...chip.outputNames()].join(', ')};\n`
  for (let part of chip.parts) {
    let mapping = {}
    for (let connection of part.connections) {
      for (let i = connection.int.start; i <= connection.int.end; i++) {
        mapping[connection.int.name + i] = connection.ext.name + (i + connection.ext.start)
      }
      mapping[connection.int.name] = connection.ext.name
    }
    fntext += `  ${compileJsCall(part.chip, mapping)}\n`;
  }
  fntext += `  return [${chip.outputNames().join(', ')}];\n`
  fntext += `}`
  return fntext;
}

export function concatJs (chipRegistry) {
  let text = ''
  for (let chip of chipRegistry.values()) {
    if (chip.name === 'Nand') {
      text += `// builtin
function Nand (a, b) {
  return [Number(!(a && b))];
}\n\n`
    } else {
      text += `${compileChip(chip)}\n\n`
    }
  }
  return text;
}


export function compileJs (chipRegistry) {
  return Function(`"use strict";

${concatJs(chipRegistry)}return {${[...chipRegistry.keys()].join(', ')}}`);
}
