const boardInput = ['i_Switch_2', 'i_Switch_4'];
const boardOutput = ['wire_0[0]', 'wire_0[1]', 'wire_0[2]', 'wire_0[3]', 'wire_0[4]', 'wire_0[5]', 'wire_0[6]', 'wire_0[7]', 'o_LED_1', 'o_LED_2', 'o_LED_3', 'o_LED_4'];

export function compileGoBoardWrapper (chip) {
  return `
\`include "./design.sv"
\`include "./lib/Debouncer.sv"
\`include "./lib/DoubleDigitDisplay.sv"

module Go_Board (
  input  i_Clk,
  input  i_Switch_1,
  input  i_Switch_2,
  input  i_Switch_3,
  input  i_Switch_4,
  output o_LED_1,
  output o_LED_2,
  output o_LED_3,
  output o_LED_4,
  output o_Segment1_A,
  output o_Segment1_B,
  output o_Segment1_C,
  output o_Segment1_D,
  output o_Segment1_E,
  output o_Segment1_F,
  output o_Segment1_G,
  output o_Segment2_A,
  output o_Segment2_B,
  output o_Segment2_C,
  output o_Segment2_D,
  output o_Segment2_E,
  output o_Segment2_F,
  output o_Segment2_G
);

  wire w_Switch_1;
  Debouncer Debouncer_1 (
    .clock(i_Clk),
    .in_0(i_Switch_1),
    .out_0(w_Switch_1)
  );

  wire w_Switch_3;
  Debouncer Debouncer_3 (
    .clock(i_Clk),
    .in_0(i_Switch_3),
    .out_0(w_Switch_3)
  );

  wire [7:0] wire_0;

  ${chip.name} ${chip.name}_MAIN (
${chip.clocked ? `    .clock(w_Switch_1 || (i_Clk && w_Switch_3)),`: ''}
${chip.inputNames().map((arg, i) => `    .${arg}(${boardInput[i] || 0})`).join(',\n')},
${chip.outputNames().slice(0,boardOutput.length).map((arg, i) => `    .${arg}(${boardOutput[i] || 0})`).join(',\n')}
  );

  DoubleDigitDisplay DoubleDigitDisplay_0 (
    .i_Byte(wire_0[7:0]),
    .o_Segment1_A(o_Segment1_A),
    .o_Segment1_B(o_Segment1_B),
    .o_Segment1_C(o_Segment1_C),
    .o_Segment1_D(o_Segment1_D),
    .o_Segment1_E(o_Segment1_E),
    .o_Segment1_F(o_Segment1_F),
    .o_Segment1_G(o_Segment1_G),
    .o_Segment2_A(o_Segment2_A),
    .o_Segment2_B(o_Segment2_B),
    .o_Segment2_C(o_Segment2_C),
    .o_Segment2_D(o_Segment2_D),
    .o_Segment2_E(o_Segment2_E),
    .o_Segment2_F(o_Segment2_F),
    .o_Segment2_G(o_Segment2_G)
  );
endmodule
`
}