import { ChipDef } from '../components/ChipDef.mjs';

export const DFF = new ChipDef(`
CHIP DFF {
  IN in;
  OUT out;
}`).addBuiltin('js', `// builtin
class DFF {
  constructor () {
    this.in_0 = 0;
    this._current = 0;
    this.out_0 = 0;
  }
  tick () {
    this.out_0 = this._current;
    this._current = this.in_0;
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
