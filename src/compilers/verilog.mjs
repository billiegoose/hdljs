function compileVerilogCall (chip, n, mapping) {
    return `${chip.name} ${chip.name}_${n} (
${[...chip.pins.keys()]
    .map(local => mapping[local] && `    .${local}(${printSlice(mapping[local])})`)
    .filter(x => x !== undefined)
    .join(',\n')}
    );`;
}

function printDecl(pin) {
  return `${pin.width > 1 ? `[${pin.width - 1}:0] ` : ''}${pin.name}`
}

function printSlice(bus) {
  return `${bus.name}${(bus.start > 0 || bus.end > 0 || bus.pin.width > 1) ? `[${bus.end}${bus.end !== bus.start ? `:${bus.start}` : ''}]` : ''}`
}
  
export function compileVerilogChip (chip) {
  let fntext = ''
  fntext += `module ${chip.name} (\n`
  const inputs = [...chip.in.values()].map(pin => `  input  ${printDecl(pin)}`)
  const outputs = [...chip.out.values()].map(pin => `  output ${printDecl(pin)}`)
  fntext += [...inputs, ...outputs].join(',\n');
  fntext += `
);\n`
  for (let pin of chip.internalPins.values()) {
    fntext += `  wire ${printDecl(pin)};\n`
  }
  let n = 0;
  for (let part of chip.parts) {
    let mapping = {}
    for (let connection of part.connections) {
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
