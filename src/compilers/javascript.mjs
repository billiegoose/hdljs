import { range } from './utils/range.mjs';

function compileJsCall (chip, mapping) {
  let args = [...chip.in.values()].map(pin => range(pin.width).map(i => pin.name + i).join(',')).join(',').split(',')
  let out = [...chip.out.values()].map(pin => range(pin.width).map(i => pin.name + i).join(',')).join(',').split(',')
  let fntext = '';
  fntext += `;[${out.map(local => mapping[local]).join(', ')}] = `
  fntext += `${chip.name}(${args.map(local => mapping[local]).join(', ')});`
  return fntext;
}

export function compileChip (chip) {
  const args = [...chip.in.values()].map(pin => range(pin.width).map(i => pin.name + i).join(', ')).join(', ')
  const out = [...chip.out.values()].map(pin => range(pin.width).map(i => pin.name + i).join(', ')).join(', ')
  let fntext = ''
  fntext += `function ${chip.name} (${args}) {\n`
  for (let pin of [...chip.internalPins.values(), ...chip.out.values()]) {
    for (let i = pin.start; i <= pin.end; i++) {
      fntext += `  let ${pin.name}${i};\n`
    }
  }
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
  fntext += `  return [${out}];\n`
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
      // text += `${chip.compileVerilog()}\n\n`
    }
  }
  return text;
}


export function compileJs (chipRegistry) {
  return Function(`"use strict";

${concatJs(chipRegistry)}return {${[...chipRegistry.keys()].join(', ')}}`);
}
