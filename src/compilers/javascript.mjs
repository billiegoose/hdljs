
function compileJsCall (chip, mapping) {
  let fntext = '';
  // TODO: figure out how to assign to slices
  fntext += `;[${[...chip.out.keys()].map(local => mapping[local]).join(', ')}] = `
  fntext += `${chip.name}(${[...chip.in.keys()].map(local => mapping[local]).join(', ')});`;
  return fntext;
}

export function compileChip (chip) {
  const args = [...chip.in.keys()]
  let fntext = ''
  fntext += `function ${chip.name} (${args.join(', ')}) {\n`
  for (let pin of [...chip.internalPins.values(), ...chip.out.values()]) {
    fntext += `  let ${pin.name};\n`
  }
  for (let part of chip.parts) {
    let mapping = {}
    for (let connection of part.connections) {
      mapping[connection.int.name] = connection.ext.name
    }
    fntext += `  ${compileJsCall(part.chip, mapping)}\n`;
  }
  fntext += `  return [${[...chip.out.keys()].join(', ')}];\n`
  fntext += `}`
  return fntext;
}

export function concatJs (chipRegistry) {
  let text = ''
  for (let chip of chipRegistry.values()) {
    if (chip.name === 'Nand') {
      text += `function Nand (a, b) {
  // builtin
  let out;
  out = Number(!(a && b));
  return [out];
}
\n`
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
