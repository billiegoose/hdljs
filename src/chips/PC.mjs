import { ChipDef } from '../components/ChipDef.mjs';

export const PC = new ChipDef(`
CHIP PC {
  IN load, inc, reset, in[16];
  OUT out[16];

  PARTS:
  Or(a=load, b=inc, out=l1);
  Or(a=l1, b=reset, out=l2);
  Inc16(in=out, out=add);
  Mux16(sel=inc, a=out, b=add, out=x);
  Mux16(sel=load, a=x, b=in, out=y);
  Mux16(sel=reset, a=y, b=0, out=z);
  Register(in=z, load=l2, out=out);
}
`).test(`
| time |   in   |reset|load | inc |  out   |
| 0+   |      0 |  0  |  0  |  0  |      0 |
| 1+   |      0 |  0  |  0  |  1  |      0 |
| 2+   | -32123 |  0  |  0  |  1  |      1 |
| 3+   | -32123 |  0  |  1  |  1  |      2 |
| 4+   | -32123 |  0  |  0  |  1  | -32123 |
| 5+   | -32123 |  0  |  0  |  1  | -32122 |
| 6+   |  12345 |  0  |  1  |  0  | -32121 |
| 7+   |  12345 |  1  |  1  |  0  |  12345 |
| 8+   |  12345 |  0  |  1  |  1  |      0 |
| 9+   |  12345 |  1  |  1  |  1  |  12345 |
| 10+  |  12345 |  0  |  0  |  1  |      0 |
| 11+  |  12345 |  1  |  0  |  1  |      1 |
| 12+  |      0 |  0  |  1  |  1  |      0 |
| 13+  |      0 |  0  |  0  |  1  |      0 |
| 14+  |  22222 |  1  |  0  |  0  |      1 |
| 15   |  22222 |  1  |  0  |  0  |      0 |
`);
