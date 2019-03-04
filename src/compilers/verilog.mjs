import { pinName } from '../compilers/utils/pinName.mjs'

function compileVerilogCall (chip, n, mapping) {
  // We want to force undefined inputs to 0, but leave
  // undefined outputs disconnected, hence the mess.
  return `${chip.name} ${chip.name}_${n} (${chip.clocked ? `.clock(clock), ` : ''}${[
    ...chip.inputNames()
      .map(local => `.${local}(${mapping[local] || `1'b0`})`)
      .filter(x => x !== undefined),
    ...chip.outputNames()
      .map(local => mapping[local] && `.${local}(${mapping[local]})`)
      .filter(x => x !== undefined)
  ].join(', ')});`;
}

export function compileVerilogChip (chip) {
  let fntext = ''
  fntext += `module ${chip.name} (\n`
  const inputs = chip.inputNames().map(arg => `  input  ${arg}`)
  if (chip.clocked) {
    inputs.unshift(`  input  clock`)
  }
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
      for (let i = 0; i < connection.int.width; i++) {
        const input = pinName(connection.int.name, i + connection.int.start)
        const output = pinName(connection.ext.name, i + connection.ext.start)
        mapping[input] = output;
        // slight alteration required to avoid warnings
        if (output === '1') {
          mapping[input] = `1'b1`
        } else if (output === '0') {
          mapping[input] = `1'b0`
        }
      }
    }
    fntext += `  ${compileVerilogCall(part.chip, n++, mapping)}\n`;
  }
  fntext += `endmodule`
  return fntext;
}

export function compileVerilog (chipRegistry) {
  let text = ''
  for (let chip of chipRegistry.values()) {
    switch(chip.name) {
      case 'Nand': {
        text += `module Nand (
  input a_0,
  input b_0,
  output out_0
  );
  
  assign out_0 = ~(a_0 & b_0);
endmodule
\n`
        break;
      }
      case 'Copy': {
        text += `module Copy (
  input in_0,
  output out_0
  );
  
  assign out_0 = in_0;
endmodule
\n`
        break;
      }
      case 'DFF': {
        text += `module DFF (
  input clock,
  input in_0,
  output out_0
  );

  reg mem_0;
  always @ (posedge clock) begin
    mem_0 <= in_0;
  end

  assign out_0 = mem_0;
endmodule
\n`
        break;
      }
      default: {
        text += `${compileVerilogChip(chip)}\n\n`
      }
    }
  }
  return text
}
