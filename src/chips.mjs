
global.chipRegistry = new Map();

import { ChipDef } from './components/ChipDef.mjs';

export const Nand = new ChipDef(`
CHIP Nand {
  IN a,b;
  OUT out;
}`)

export const Not = new ChipDef(`
CHIP Not {
  IN a;
  OUT out;
  Nand(a=a, b=a, out=out);
}`);


export const And = new ChipDef(`
CHIP And {
  IN a, b;
  OUT out;
  PARTS:
  Nand(a=a, b=b, out=c);
  Not(a=c, out=out);
}`)

export const Or = new ChipDef(`
CHIP Or {
  IN a, b;
  OUT out;
  PARTS:
  Not(a=a, out=na);
  Not(a=b, out=nb);
  Nand(a=na, b=nb, out=out);
}`)
