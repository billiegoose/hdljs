import { ChipDef } from '../components/ChipDef.mjs';

export const DMux = new ChipDef(`
CHIP DMux {
  IN sel, in;
  OUT a, b;

  PARTS:
  Not(in=sel, out=nsel);
  And(a=in, b=nsel, out=a);
  And(a=in, b=sel, out=b);
}`).test(`
|  in   |  sel  |   a   |   b   |
|   0   |   0   |   0   |   0   |
|   0   |   1   |   0   |   0   |
|   1   |   0   |   1   |   0   |
|   1   |   1   |   0   |   1   |
`);
