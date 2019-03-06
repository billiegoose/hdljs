import { ChipDef } from '../components/ChipDef.mjs';

export const Or = new ChipDef(`
CHIP Or {
  IN a, b;
  OUT out;

  PARTS:
  Not(in=a, out=na);
  Not(in=b, out=nb);
  Nand(a=na, b=nb, out=out);
}`).test(`
|   a   |   b   |  out  |
|   0   |   0   |   0   |
|   0   |   1   |   1   |
|   1   |   0   |   1   |
|   1   |   1   |   1   |
`);
