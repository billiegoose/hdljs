import { ChipDef } from '../components/ChipDef.mjs';

export const Blop = new ChipDef(`
CHIP Blop {
  IN in;
  OUT out;

  PARTS:
  DFF(in=in, out=val);
  Copy(in=val, out=prev);
  Not(in=in, out=inv);
  And(a=prev, b=inv, out=out);
}
`);
