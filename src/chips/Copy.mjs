import { ChipDef } from '../components/ChipDef.mjs';

export const Copy = new ChipDef(`
CHIP Copy {
  IN in;
  OUT out;
}`).addBuiltin('js', `// builtin
function Copy () {
  return function Copy (input) {
    return [Number(input)];
  }
}`).addBuiltin('verilog', `// builtin
module Copy (
  input in_0,
  output out_0
  );

  assign out_0 = in_0;
endmodule`);
