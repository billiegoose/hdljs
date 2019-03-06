import { ChipDef } from '../components/ChipDef.mjs';

export const And = new ChipDef(`
CHIP And {
  IN a, b;
  OUT out;

  PARTS:
  Nand(a=a, b=b, out=c);
  Not(in=c, out=out);
}`).test(`
|   a   |   b   |  out  |
|   0   |   0   |   0   |
|   0   |   1   |   0   |
|   1   |   0   |   0   |
|   1   |   1   |   1   |
`)