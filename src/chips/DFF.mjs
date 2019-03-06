import { ChipDef } from '../components/ChipDef.mjs';

export const DFF = new ChipDef(`
CHIP DFF {
  IN in;
  OUT out;
}`).addBuiltin('js', `// builtin
function DFF () {
  let _current = 0;
  return function DFF (input) {
    if (input === undefined) {
      return [_current];
    } else {
      let tmp = _current;
      _current = input;
      return [tmp];
    }
  }
}`).addBuiltin('verilog', `// builtin
module DFF (
  input clock,
  input in_0,
  output out_0
  );

  reg mem_0;
  always @ (posedge clock) begin
    mem_0 <= in_0;
  end

  assign out_0 = mem_0;
endmodule`);

DFF.clocked = true;
