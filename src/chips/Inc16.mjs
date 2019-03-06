import { ChipDef } from '../components/ChipDef.mjs';

export const Inc16 = new ChipDef(`
CHIP Inc16 {
  IN in[16];
  OUT out[16];

  PARTS:
  Add16(a=in, b[0]=1, out=out);
}
`)
.test(`
|        in        |       out        |
| 0000000000000000 | 0000000000000001 |
| 1111111111111111 | 0000000000000000 |
| 0000000000000101 | 0000000000000110 |
| 1111111111111011 | 1111111111111100 |
`);
