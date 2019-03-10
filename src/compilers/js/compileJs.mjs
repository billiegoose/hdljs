import { pinName } from '../../utils/pinName.mjs';

function wrapArg (name) {
  if (name === '0' || name === '1') return name;
  if (name === undefined) return '0';
  return `this.${name}`
}

function compileTick (chip, mapping, i) {
  let fntext = `    // ${chip.name}(${Object.entries(mapping).map(([key, val]) => `${key}=${val}`).join(', ')})\n`;
  for (let name of [...chip.inputNames()]) {
    fntext += `    this.${chip.name}_${i}.${name} = ${wrapArg(mapping[name])};\n`
  }
  fntext += `    this.${chip.name}_${i}.tick();\n`
  for (let name of [...chip.outputNames()]) {
    if (mapping[name]) {
      fntext += `    this.${mapping[name]} = this.${chip.name}_${i}.${name};\n`
    }
  }
  return fntext;
}

function compileTock (chip, mapping, i) {
  let fntext = `    this.${chip.name}_${i}.tock();\n`
  for (let name of [...chip.outputNames()]) {
    if (mapping[name]) {
      fntext += `    this.${mapping[name]} = this.${chip.name}_${i}.${name};\n`
    }
  }
  return fntext;
}

export function compileChip (chip) {
  let fntext = ''
  fntext += `class ${chip.name} {\n`
  fntext += `  constructor () {\n`
  fntext += chip.inputNames().length > 0 ? `    // inputs\n` : ''
  for (let name of chip.inputNames()) {
    fntext += `    this.${name} = 0;\n`
  }
  fntext += chip.outputNames().length > 0 ? `    // outputs\n` : ''
  for (let name of chip.outputNames()) {
    fntext += `    this.${name} = 0;\n`
  }
  fntext += chip.internalNames().length > 0 ? `    // internal\n` : ''
  for (let name of chip.internalNames()) {
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
    let mapping = {}
    for (let connection of part.connections) {
      for (let i = 0; i < connection.int.width; i++) {
        const input = pinName(connection.int.name, i + connection.int.start)
        const output = pinName(connection.ext.name, i + connection.ext.start)
        mapping[input] = output;
      }
    }
    fntext += compileTick(part.chip, mapping, i);
  }
  fntext += `  }\n`
  fntext += `  tock () {\n`
  for (let i = 0; i < chip.parts.length; i++) {
    let part = chip.parts[i];
    fntext += `    this.${part.chip.name}_${i}.tock();\n`
  }
  fntext += `    this.tick();\n`
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