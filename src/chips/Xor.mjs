import { ChipDef } from '../components/ChipDef.mjs';

export const Xor = new ChipDef(`
CHIP Xor {
  IN a, b;
  OUT out;

  PARTS:
  Nand(a=a, b=b, out=x);
  Nand(a=a, b=x, out=y);
  Nand(a=x, b=b, out=z);
  Nand(a=y, b=z, out=out);
}`).test(`
|   a   |   b   |  out  |
|   0   |   0   |   0   |
|   0   |   1   |   1   |
|   1   |   0   |   1   |
|   1   |   1   |   0   |
`);
