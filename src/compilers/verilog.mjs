function compileVerilogCall (chip, n, mapping) {
  // We want to force undefined inputs to 0, but leave
  // undefined outputs disconnected, hence the mess.
  return `${chip.name} ${chip.name}_${n} (${[
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
        switch(connection.ext.name) {
          case 'true':
          case '1': {
            mapping[connection.int.name + i] = `1'b1`;
            break;
          }
          case 'false':
          case '0': {
            mapping[connection.int.name + i] = `1'b0`;
            break;
          }
          default: {
            mapping[connection.int.name + i] = connection.ext.name + (i + connection.ext.start)
          }
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
