import { ChipDef } from '../components/ChipDef.mjs';

export const Nand = new ChipDef(`
CHIP Nand {
  IN a,b;
  OUT out;
}`).addBuiltin('js', `// builtin
function Nand () {
  return function Nand (a, b) {
    return [Number(!(a && b))];
  }
}`).addBuiltin('verilog', `// builtin
module Nand (
  input a_0,
  input b_0,
  output out_0
  );

  assign out_0 = ~(a_0 & b_0);
endmodule`);
