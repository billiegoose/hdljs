import { pinName } from '../../utils/pinName.mjs';

function wrapArg (name) {
  if (name === '0' || name === '1') return name;
  if (name === undefined) return '0';
  return `this.${name}`
}

function compileJsCall (chip, mapping, i) {
  let fntext = '';
  for (let name of [...chip.inputNames()]) {
    fntext += `    this.${chip.name}_${i}.${name} = ${wrapArg(mapping[name])};\n`
  }
  fntext += `    this.${chip.name}_${i}.tick();\n`
  for (let name of [...chip.outputNames()]) {
    if (mapping[name]) {
      fntext += `    this.${mapping[name]} = this.${chip.name}_${i}.${name};\n`
    }
  }
  fntext += '\n'
  return fntext;
}

function compileJsRegisterRead (chip, mapping, i) {
  let fntext = '';
  for (const name of chip.outputNames()) {
    if (mapping[name] !== undefined) {
      fntext += `    this.${mapping[name]} = this.${chip.name}_${i}.${name};`
    }
  }
  return fntext;
}

export function compileChip (chip) {
  let fntext = ''
  fntext += `class ${chip.name} {\n`
  fntext += `  constructor () {\n`
  for (let name of [...chip.internalNames(), ...chip.outputNames()]) {
    fntext += `    this.${name} = 0;\n`
  }
  for (let i = 0; i < chip.parts.length; i++) {
    let part = chip.parts[i];
    fntext += `    this.${part.chip.name}_${i} = new ${part.chip.name}();\n`
  }
  fntext += `  }\n`
  fntext += `  tick () {\n`
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
      fntext += `${compileJsRegisterRead(part.chip, mapping, i)}\n\n`;
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
    fntext += compileJsCall(part.chip, mapping, i);
  }
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