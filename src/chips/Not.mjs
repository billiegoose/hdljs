import { ChipDef } from '../components/ChipDef.mjs';

export const Not = new ChipDef(`
CHIP Not {
  IN in;
  OUT out;

  PARTS:
  Nand(a=in, b=in, out=out);
}`).test(`
|  in   |  out  |
|   0   |   1   |
|   1   |   0   |
`);
