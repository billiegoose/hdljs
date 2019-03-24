import { ChipDef } from '../components/ChipDef.mjs';

export const Mux8Way = new ChipDef(`
CHIP Mux8Way {
  IN sel[3], in[8];
  OUT out;

  PARTS:
  Mux4Way(a=in[0], b=in[1], c=in[2], d=in[3], sel=sel[0..1], out=x);
  Mux4Way(a=in[4], b=in[5], c=in[6], d=in[7], sel=sel[0..1], out=y);
  Mux(a=x, b=y, sel=sel[2], out=out);
}`);
