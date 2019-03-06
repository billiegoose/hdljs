import { ChipDef } from '../components/ChipDef.mjs';

export const FullAdder = new ChipDef(`
CHIP FullAdder {
  IN a, b, c;
  OUT sum, carry;

  PARTS:
  HalfAdder(a=a, b=b, sum=x, carry=y);
  HalfAdder(a=x, b=c, sum=sum, carry=z);
  Or(a=y, b=z, out=carry);
}`).test(`
|   a   |   b   |   c   |  sum  | carry |
|   0   |   0   |   0   |   0   |   0   |
|   0   |   0   |   1   |   1   |   0   |
|   0   |   1   |   0   |   1   |   0   |
|   0   |   1   |   1   |   0   |   1   |
|   1   |   0   |   0   |   1   |   0   |
|   1   |   0   |   1   |   0   |   1   |
|   1   |   1   |   0   |   0   |   1   |
|   1   |   1   |   1   |   1   |   1   |
`);
