import { ChipDef } from '../components/ChipDef.mjs';

export const HighImpedence = new ChipDef(`
CHIP HighImpedence {
  OUT out;
  PARTS:
  // We can't really simulate this
  Copy(in=false, out=out);
}`).addBuiltin('js', `// builtin
class HighImpedence {
  constructor () {
    this.out_0 = 0;
  }
  tick () {
  }
  tock () {
    // noop
  }
}
`).addBuiltin('verilog', `// builtin
module HighImpedence (
  output out_0
  );

  assign out_0 = z;
endmodule`);
