import { ChipDef } from '../components/ChipDef.mjs';

export const DMux4Way = new ChipDef(`
CHIP DMux4Way {
  IN sel[2], in;
  OUT a, b, c, d;

  PARTS:
  DMux(in=in, sel=sel[1], a=x, b=y);
  DMux(in=x, sel=sel[0], a=a, b=b);
  DMux(in=y, sel=sel[0], a=c, b=d);
}`).test(`
| in  | sel  |  a  |  b  |  c  |  d  |
|  0  |  00  |  0  |  0  |  0  |  0  |
|  0  |  01  |  0  |  0  |  0  |  0  |
|  0  |  10  |  0  |  0  |  0  |  0  |
|  0  |  11  |  0  |  0  |  0  |  0  |
|  1  |  00  |  1  |  0  |  0  |  0  |
|  1  |  01  |  0  |  1  |  0  |  0  |
|  1  |  10  |  0  |  0  |  1  |  0  |
|  1  |  11  |  0  |  0  |  0  |  1  |
`)
