import { ChipDef } from '../components/ChipDef.mjs';

export const Nand = new ChipDef(`
CHIP Nand {
  IN a,b;
  OUT out;
}`).addBuiltin('js', `// builtin
class Nand {
  constructor () {
    this.a_0 = 0;
    this.b_0 = 0;
  }
  tick () {
    this.out_0 = Number(!(this.a_0 && this.b_0));
  }
}`).addBuiltin('verilog', `// builtin
module Nand (
  input a_0,
  input b_0,
  output out_0
  );

  assign out_0 = ~(a_0 & b_0);
endmodule`);
