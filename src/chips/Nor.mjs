import { ChipDef } from '../components/ChipDef.mjs';

export const Nor = new ChipDef(`
CHIP Nor {
  IN a, b;
  OUT out;

  PARTS:
  Or(a=a, b=b, out=x);
  Not(in=x, out=out);
}`).test(`
|   a   |   b   |  out  |
|   0   |   0   |   1   |
|   0   |   1   |   0   |
|   1   |   0   |   0   |
|   1   |   1   |   0   |
`);
