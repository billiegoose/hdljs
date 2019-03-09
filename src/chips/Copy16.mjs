import { ChipDef } from '../components/ChipDef.mjs';

export const Copy16 = new ChipDef(`
CHIP Copy16 {
  IN in[16];
  OUT out[16];
}`).addBuiltin('js', `// builtin
function Copy16 () {
  return function Copy16 (...inputs) {
    return inputs.map(Number);
  }
}`).addBuiltin('verilog', `// builtin
module Copy16 (
  input in_0,
  input in_1,
  input in_2,
  input in_3,
  input in_4,
  input in_5,
  input in_6,
  input in_7,
  input in_8,
  input in_9,
  input in_10,
  input in_11,
  input in_12,
  input in_13,
  input in_14,
  input in_15,
  output out_1,
  output out_2,
  output out_3,
  output out_4,
  output out_5,
  output out_6,
  output out_7,
  output out_8,
  output out_9,
  output out_10,
  output out_11,
  output out_12,
  output out_13,
  output out_14,
  output out_15
  );

  assign out_0 = in_0;
  assign out_1 = in_1;
  assign out_2 = in_2;
  assign out_3 = in_3;
  assign out_4 = in_4;
  assign out_5 = in_5;
  assign out_6 = in_6;
  assign out_7 = in_7;
  assign out_8 = in_8;
  assign out_9 = in_9;
  assign out_10 = in_10;
  assign out_11 = in_11;
  assign out_12 = in_12;
  assign out_13 = in_13;
  assign out_14 = in_14;
  assign out_15 = in_15;
endmodule`);
