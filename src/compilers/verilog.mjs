function compileVerilogCall (chip, n, mapping) {
    return `${chip.name} ${chip.name}_${n} (
${[...chip.pins.keys()]
    .map(local => mapping[local] && `    .${local}(${mapping[local]})`)
    .filter(x => x !== undefined)
    .join(',\n')}
    );`;
}
  
export function compileVerilogChip (chip) {
  let fntext = ''
  fntext += `module ${chip.name} (\n`
  const inputs = [...chip.in.keys()].map(x => `  input  ${x}`)
  const outputs = [...chip.out.keys()].map(x => `  output ${x}`)
  fntext += [...inputs, ...outputs].join(',\n');
  fntext += `
);\n`
  for (let pin of chip.internalPins.values()) {
    fntext += `  wire ${pin.name};\n`
  }
  let n = 0;
  for (let part of chip.parts) {
    let mapping = {}
    for (let connection of part.connections) {
      mapping[connection.int.name] = connection.ext.name
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
  input a,
  input b,
  output out
  );
  
  assign out = ~(a & b);
endmodule
\n`
    } else {
      text += `${compileVerilogChip(chip)}\n\n`
    }
  }
  return text
}
