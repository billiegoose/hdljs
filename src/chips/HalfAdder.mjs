import { ChipDef } from '../components/ChipDef.mjs';

export const HalfAdder = new ChipDef(`
CHIP HalfAdder {
  IN a, b;
  OUT sum, carry;

  PARTS:
  Xor(a=a, b=b, out=sum);
  And(a=a, b=b, out=carry);
}`).test(`
|   a   |   b   |  sum  | carry |
|   0   |   0   |   0   |   0   |
|   0   |   1   |   1   |   0   |
|   1   |   0   |   1   |   0   |
|   1   |   1   |   0   |   1   |
`);
