import { ChipDef } from '../components/ChipDef.mjs';

export const Copy = new ChipDef(`
CHIP Copy {
  IN in;
  OUT out;
}`).addBuiltin('js', `// builtin
class Copy {
  constructor () {
    this.out_0 = 0;
  }
  tick () {
    this.out_0 = this.in_0;
  }
  tock () {
    // noop
  }
}
`).addBuiltin('verilog', `// builtin
module Copy (
  input in_0,
  output out_0
  );

  assign out_0 = in_0;
endmodule`);
