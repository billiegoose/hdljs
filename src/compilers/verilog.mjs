import { range } from './utils/range.mjs';
import { flatten } from './utils/flatten.mjs';

function compileVerilogCall (chip, n, mapping) {
  let args = [...chip.inputNames(), ...chip.outputNames()]
  return `${chip.name} ${chip.name}_${n} (${args
    .map(local => mapping[local] && `.${local}(${mapping[local]})`)
    .filter(x => x !== undefined)
    .join(', ')});`;
}

function printDecl(pin) {
  return `${pin.width > 1 ? `[${pin.width - 1}:0] ` : ''}${pin.name}`
}
  
export function compileVerilogChip (chip) {
  let fntext = ''
  fntext += `module ${chip.name} (\n`
  const inputs = chip.inputNames().map(arg => `  input  ${arg}`)
  const outputs = chip.outputNames().map(arg => `  output ${arg}`)
  fntext += [...inputs, ...outputs].join(',\n');
  fntext += `
);\n`
  for (let arg of chip.internalNames()) {
    fntext += `  wire ${arg};\n`
  }
  let n = 0;
  for (let part of chip.parts) {
    let mapping = {}
    for (let connection of part.connections) {
      for (let i = connection.int.start; i <= connection.int.end; i++) {
        mapping[connection.int.name + i] = connection.ext.name + (i + connection.ext.start)
      }
      mapping[connection.int.name] = connection.ext
    }
    fntext += `  ${compileVerilogCall(part.chip, n++, mapping)}\n`;
  }
  fntext += `endmodule`
  return fntext;
}

export function compileVerilog (chipRegistry) {
  let text = ''
  for (let chip of chipRegistry.values()) {
    if (chip.name === 'Nand') {
      text += `module Nand (
  input a0,
  input b0,
  output out0
  );
  
  assign out0 = ~(a0 & b0);
endmodule
\n`
    } else {
      text += `${compileVerilogChip(chip)}\n\n`
    }
  }
  return text
}
