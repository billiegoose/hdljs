import { ChipDef } from '../components/ChipDef.mjs';

export const Or8Way = new ChipDef(`
CHIP Or8Way {
  IN in[8];
  OUT out;

  PARTS:
  Or(a=in[0], b=in[1], out=c0);
  Or(a=in[2], b=in[3], out=c1);
  Or(a=in[4], b=in[5], out=c2);
  Or(a=in[6], b=in[7], out=c3);
  Or(a=c0, b=c1, out=d0);
  Or(a=c2, b=c3, out=d1);
  Or(a=d0, b=d1, out=out);
}`).test(`
|     in     | out |
|  00000000  |  0  |
|  11111111  |  1  |
|  00010000  |  1  |
|  00000001  |  1  |
|  00100110  |  1  |
`);
