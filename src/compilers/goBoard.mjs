const boardInput = ['i_Switch_1', 'i_Switch_2', 'i_Switch_3', 'i_Switch_4'];
const boardOutput = ['o_LED_1', 'o_LED_2', 'o_LED_3', 'o_LED_4'];

export function compileGoBoardWrapper (chip) {
  return `
\`include "./design.sv"

module Go_Board (
  input  i_Clk,
${boardInput.map((arg, i) => `  input  ${arg}`).join(',\n')},
${boardOutput.map((arg, i) => `  output ${arg}`).join(',\n')}
  );

  ${chip.name} ${chip.name}_MAIN (
${chip.clocked ? `    .clock(i_Clk),`: ''}
${chip.inputNames().map((arg, i) => `    .${arg}(${boardInput[i] || 0})`).join(',\n')},
${chip.outputNames().slice(0,4).map((arg, i) => `    .${arg}(${boardOutput[i] || 0})`).join(',\n')}
  );

endmodule
`
}