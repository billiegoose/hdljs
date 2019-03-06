import { ChipDef } from '../components/ChipDef.mjs';

export const Mux = new ChipDef(`
CHIP Mux {
  IN sel, a, b;
  OUT out;

  PARTS:
  Not(in=sel, out=nsel);
  Nand(a=nsel, b=a, out=sela);
  Nand(a=sel, b=b, out=selb);
  Nand(a=sela, b=selb, out=out);
}`).test(`
|   a   |   b   |  sel  |  out  |
|   0   |   0   |   0   |   0   |
|   0   |   0   |   1   |   0   |
|   0   |   1   |   0   |   0   |
|   0   |   1   |   1   |   1   |
|   1   |   0   |   0   |   1   |
|   1   |   0   |   1   |   0   |
|   1   |   1   |   0   |   1   |
|   1   |   1   |   1   |   1   |
`);
