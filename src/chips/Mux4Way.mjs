import { ChipDef } from '../components/ChipDef.mjs';

export const Mux4Way = new ChipDef(`
CHIP Mux4Way {
  IN sel[2], a, b, c, d;
  OUT out;

  PARTS:
  Mux(a=a, b=b, sel=sel[0], out=x);
  Mux(a=c, b=d, sel=sel[0], out=y);
  Mux(a=x, b=y, sel=sel[1], out=out);
}`);