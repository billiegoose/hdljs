import { pinName } from '../../utils/pinName.mjs';

function compileJsCall (chip, mapping, i) {
  let fntext = '';
  fntext += `;[${chip.outputNames().map(local => mapping[local]).join(', ')}] = `
  fntext += `${chip.name}_${i}(${chip.inputNames().map(local => mapping[local] || 0).join(', ')});`
  return fntext;
}

function compileJsRegisterRead (chip, mapping, i) {
  let fntext = '';
  fntext += `;[${chip.outputNames().map(local => mapping[local]).join(', ')}] = ${chip.name}_${i}();`
  return fntext;
}

export function compileChip (chip) {
  let fntext = ''
  fntext += `function ${chip.name} () {\n`
  fntext += `  let ${[...chip.internalNames(), ...chip.outputNames()].join(', ')};\n`
  for (let i = 0; i < chip.parts.length; i++) {
    let part = chip.parts[i];
    fntext += `  let ${part.chip.name}_${i} = ${part.chip.name}();\n`
  }
  fntext += `  return function ${chip.name} (${chip.inputNames().join(', ')}) {\n`
  if (chip.clocked) {
    fntext += `    if (${chip.inputNames()[0]} === undefined) return [${chip.outputNames().join(', ')}];\n`
  }
  for (let i = 0; i < chip.parts.length; i++) {
    let part = chip.parts[i];
    if (part.chip.clocked) {
      let mapping = {}
      for (let connection of part.connections) {
        for (let i = 0; i < connection.int.width; i++) {
          const input = pinName(connection.int.name, i + connection.int.start)
          const output = pinName(connection.ext.name, i + connection.ext.start)
          mapping[input] = output;
        }
      }
      fntext += `    ${compileJsRegisterRead(part.chip, mapping, i)}\n`;
    }
  }
  for (let i = 0; i < chip.parts.length; i++) {
    let part = chip.parts[i];
    let mapping = {}
    for (let connection of part.connections) {
      for (let i = 0; i < connection.int.width; i++) {
        const input = pinName(connection.int.name, i + connection.int.start)
        const output = pinName(connection.ext.name, i + connection.ext.start)
        mapping[input] = output;
      }
    }
    fntext += `    ${compileJsCall(part.chip, mapping, i)}\n`;
  }
  fntext += `    return [${chip.outputNames().join(', ')}];\n`
  fntext += `  }\n`
  fntext += `}`
  return fntext;
}

export function concatJs (chipRegistry) {
  let text = ''
  for (let chip of chipRegistry.values()) {
    if (chip.builtin && chip.builtin.js) {
      text += chip.builtin.js + '\n\n';
    } else {
      text += `${compileChip(chip)}\n\n`;
    }
  }
  return text;
}


export function compileJs (chipRegistry) {
  return Function(`"use strict";

${concatJs(chipRegistry)}return {${[...chipRegistry.keys()].join(', ')}}`);
}