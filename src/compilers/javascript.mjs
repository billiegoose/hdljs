import { pinName } from './utils/pinName.mjs';

function compileJsCall (chip, mapping, i) {
  let fntext = '';
  fntext += `;[${chip.outputNames().map(local => mapping[local]).join(', ')}] = `
  fntext += `${chip.name}_${i}(${chip.inputNames().map(local => mapping[local] || 0).join(', ')});`
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
    switch(chip.name) {
      case 'Nand': {
        text += `// builtin
function Nand () {
  return function Nand (a, b) {
    return [Number(!(a && b))];
  }
}\n\n`;
        break;
      }
      case 'Copy': {
        text += `// builtin
function Copy () {
  return function Copy (input) {
    return [Number(input)];
  }
}\n\n`;
        break;
      }
      case 'DFF': {
        text += `// builtin
function DFF () {
  let _current = 0;
  return function DFF (input) {
    if (input === undefined) {
      return [_current];
    } else {
      let tmp = _current;
      _current = input;
      return [tmp];
    }
  }
}\n\n`;
        break;
      }
      default: {
        text += `${compileChip(chip)}\n\n`
      }
    }
  }
  return text;
}


export function compileJs (chipRegistry) {
  return Function(`"use strict";

${concatJs(chipRegistry)}return {${[...chipRegistry.keys()].join(', ')}}`);
}

export function testJs (chipRegistry) {
  const chips = compileJs(chipRegistry)()
  for (let chip of chipRegistry.values()) {
    if (chip.examples) {
      let chipInstance = chips[chip.name]();
      for (let e = 0; e < chip.examples.length; e++) {
        const example = chip.examples[e];
        const inputValues = chip.inputNames().map(x => example[x])
        const outputValues = chip.outputNames().map(x => example[x])
        const result = chipInstance.apply(null, inputValues);
        if (result.length !== outputValues.length) {
          throw new Error(`[${chip.name} chip] Unexpected length mismatch: expected ${outputValues.length} outputs but JS version of chip only output ${result.length}`)
        }
        for (let i = 0; i < result.length; i++) {
          if (result[i] !== outputValues[i]) {
            throw new Error(`[${chip.name} chip] Test #${e + 1} failed for output ${chip.outputNames()[i]}. Expected value ${outputValues[i]}. Actual value ${result[i]}.`)
          }
        }
      }
    }
  }
}