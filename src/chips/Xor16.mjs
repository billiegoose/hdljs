import { ChipDef } from '../components/ChipDef.mjs';

export const Xor16 = new ChipDef(`
CHIP Xor16 {
  IN a[16], b[16];
  OUT out[16];

  PARTS:
  Xor(a=a[0], b=b[0], out=out[0]);
  Xor(a=a[1], b=b[1], out=out[1]);
  Xor(a=a[2], b=b[2], out=out[2]);
  Xor(a=a[3], b=b[3], out=out[3]);
  Xor(a=a[4], b=b[4], out=out[4]);
  Xor(a=a[5], b=b[5], out=out[5]);
  Xor(a=a[6], b=b[6], out=out[6]);
  Xor(a=a[7], b=b[7], out=out[7]);
  Xor(a=a[8], b=b[8], out=out[8]);
  Xor(a=a[9], b=b[9], out=out[9]);
  Xor(a=a[10], b=b[10], out=out[10]);
  Xor(a=a[11], b=b[11], out=out[11]);
  Xor(a=a[12], b=b[12], out=out[12]);
  Xor(a=a[13], b=b[13], out=out[13]);
  Xor(a=a[14], b=b[14], out=out[14]);
  Xor(a=a[15], b=b[15], out=out[15]);
}`).test(`
|        a         |        b         |       out        |
| 0000000000000000 | 0000000000000000 | 0000000000000000 |
| 0000000000000000 | 1111111111111111 | 1111111111111111 |
| 1111111111111111 | 1111111111111111 | 0000000000000000 |
| 1010101010101010 | 0101010101010101 | 1111111111111111 |
| 0011110011000011 | 0000111111110000 | 0011001100110011 |
| 0001001000110100 | 1001100001110110 | 1000101001000010 |
`);
