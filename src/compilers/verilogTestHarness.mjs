import { combinations } from './utils/combinations.mjs';

export function compileVerilogTestHarnessChip (chip, jsChip) {
    return `module ${chip.name}_Testbench ();
  // Local vars
${[...chip.in.values()].map(arg =>
  `  reg ${arg.name} = ${arg.width}'b0;`
).join('\n')}
${[...chip.out.values()].map(arg =>
  `  wire ${arg.name};`
).join('\n')}
    
  // Instantiate unit to test
  ${chip.name} ${chip.name} (
${[...chip.pins.keys()].map(name =>
  `    .${name}(${name})`
).join(',\n')}
  );

  // Test code
  initial begin
    $monitor("time: %d | ${[...chip.pins.keys()].map(name =>
      `${name}= %b`
    ).join(' | ')}",$time,${[...chip.pins.keys()].join(',')});
${(() => {
  let widths = [...chip.in.values()].map(x => x.width);
  let names = [...chip.in.values()].map(x => x.name);
  let text = ''
  combinations(widths, (values) => {
    text += `    `
    for (let i = 0; i < names.length; i++) {
      text += `${names[i]} <= ${values[i]}; `
    }
    text += `#1`
    // TODO: compute value from JS version and add assertion here.
    let result = jsChip(...values);
    let outNames = [...chip.out.keys()];
    for (let i = 0; i < outNames.length; i++) {
      // text += ` assert (${outNames[i]} == ${result[i]});`
      text += `\n    if (${outNames[i]} != ${result[i]}) begin $display("TEST FAIL on '${outNames[i]}'. Expected value ${result[i]}. Actual value %d", ${outNames[i]}); $stop; end`
    }
    text += `\n`
  });
  return text;
})()
}    #1 $finish;
  end
  
  //initial begin
  //  $dumpfile("dump.vcd"); $dumpvars;
  //end
  
endmodule`
}
