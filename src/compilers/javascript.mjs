function compileJsCall (chip, mapping) {
  let fntext = '';
  fntext += `;[${chip.outputNames().map(local => mapping[local]).join(', ')}] = `
  fntext += `${chip.name}(${chip.inputNames().map(local => mapping[local] || 0).join(', ')});`
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
        switch(connection.ext.name) {
          case 'true':
          case '1': {
            mapping[connection.int.name + i] = '1';
            break;
          }
          case 'false':
          case '0': {
            mapping[connection.int.name + i] = '0';
            break;
          }
          default: {
            mapping[connection.int.name + i] = connection.ext.name + (i + connection.ext.start)
          }
        }
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

export function testJs (chipRegistry) {
  const chips = compileJs(chipRegistry)()
  for (let chip of chipRegistry.values()) {
    if (chip.examples) {
      for (let e = 0; e < chip.examples.length; e++) {
        const example = chip.examples[e];
        const inputValues = chip.inputNames().map(x => example[x])
        const outputValues = chip.outputNames().map(x => example[x])
        const result = chips[chip.name].apply(null, inputValues);
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