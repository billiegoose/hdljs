export function compileVerilogTestHarnessChip (chip) {
    if (!chip.examples) return '';
    return `module ${chip.name}_Testbench ();
  // Local vars
${[...chip.inputNames()].map(arg =>
  `  reg ${arg} = 0;`
).join('\n')}
${[...chip.outputNames()].map(arg =>
  `  wire ${arg};`
).join('\n')}
    
  // Instantiate unit to test
  ${chip.name} ${chip.name} (
${[...chip.inputNames(), ...chip.outputNames()].map(name =>
  `    .${name}(${name})`
).join(',\n')}
  );

  // Test code
  initial begin
    $display("                            | ${[...chip.in.keys()].join(' | ')} |> ${[...chip.out.keys()].join(' | ')}");
    $monitor("time: #%d | ${
      [...chip.inputNames({group: true})].map(group =>
        group.map(name => `%b`).join('')
      ).join (' | ')} |> ${
        [...chip.outputNames({group: true})].map(group =>
          group.map(name => `%b`).join('')
        ).join(' | ')}",$time,${[...chip.inputNames(), ...chip.outputNames()].join(',')});
${(() => {
  let names = chip.inputNames();
  let text = ''
  let i = 0;
  for (let example of chip.examples) {
    i++;
    text += names.map(name => `    ${name} <= ${example[name]};\n`).join(``)
    text += `    #1`
    let outNames = chip.outputNames();
    for (const name of outNames) {
      // text += ` assert (${outNames[i]} == ${result[i]});`
      text += `\n    if (${name} != ${example[name]}) begin $display("TEST #${i} FAILED on '${name}'. Expected value ${example[name]}. Actual value %d", ${name}); $stop; end`
    }
    text += `\n`
  }
  return text;
})()
}    #1 $finish;
  end
  
  //initial begin
  //  $dumpfile("dump.vcd"); $dumpvars;
  //end
  
endmodule`
}
