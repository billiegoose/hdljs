import { ChipDef } from '../components/ChipDef.mjs';

export const Copy16 = new ChipDef(`
CHIP Copy16 {
  IN in[16];
  OUT out[16];
}`).addBuiltin('js', `// builtin
class Copy16 {
  constructor () {
    this.out_0 = 0;
    this.out_1 = 0;
    this.out_2 = 0;
    this.out_3 = 0;
    this.out_4 = 0;
    this.out_5 = 0;
    this.out_6 = 0;
    this.out_7 = 0;
    this.out_8 = 0;
    this.out_9 = 0;
    this.out_10 = 0;
    this.out_11 = 0;
    this.out_12 = 0;
    this.out_13 = 0;
    this.out_14 = 0;
    this.out_15 = 0;
  }
  tick () {
    this.out_0 = this.in_0;
    this.out_1 = this.in_1;
    this.out_2 = this.in_2;
    this.out_3 = this.in_3;
    this.out_4 = this.in_4;
    this.out_5 = this.in_5;
    this.out_6 = this.in_6;
    this.out_7 = this.in_7;
    this.out_8 = this.in_8;
    this.out_9 = this.in_9;
    this.out_10 = this.in_10;
    this.out_11 = this.in_11;
    this.out_12 = this.in_12;
    this.out_13 = this.in_13;
    this.out_14 = this.in_14;
    this.out_15 = this.in_15;
  }
  tock () {
    // noop
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
