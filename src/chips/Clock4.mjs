import { ChipDef } from '../components/ChipDef.mjs';

export const Clock4 = new ChipDef(`
CHIP Clock4 {
  IN pulseClock, reset, begin;
  OUT state0, state1, state2, state3, carry;

  PARTS:
  // State machine
  Or(a=pulseClock, b=reset, out=load);
  And(a=pulseClock, b=begin, out=start);
  Mux(sel=reset, a=start, b=false, out=bit0);
  Mux(sel=reset, a=s0, b=false, out=bit1);
  Mux(sel=reset, a=s1, b=false, out=bit2);
  Mux(sel=reset, a=s2, b=false, out=bit3);
  Mux(sel=reset, a=s3, b=false, out=bit4);
  Bit(in=bit0, load=load, out=s0);
  Bit(in=bit1, load=load, out=s1);
  Bit(in=bit2, load=load, out=s2);
  Bit(in=bit3, load=load, out=s3);
  Bit(in=bit4, load=load, out=s4);
  Copy(in=s0, out=state0);
  Copy(in=s1, out=state1);
  Copy(in=s2, out=state2);
  Copy(in=s3, out=state3);
  Copy(in=s4, out=carry);
}`).test(`
| time | reset | pulseClock |state0|state1|state2|state3|carry|
| 1    |    1  |      1     |   1  |   0  |   0  |   0  |  0  |
| 2    |    0  |      1     |   0  |   1  |   0  |   0  |  0  |
| 3    |    0  |      1     |   0  |   0  |   1  |   0  |  0  |
| 4    |    0  |      1     |   0  |   0  |   0  |   1  |  0  |
| 5    |    1  |      1     |   1  |   0  |   0  |   0  |  0  |
| 6    |    0  |      1     |   0  |   1  |   0  |   0  |  0  |
| 7    |    0  |      1     |   0  |   0  |   1  |   0  |  0  |
| 8    |    0  |      1     |   0  |   0  |   0  |   1  |  0  |
| 9    |    1  |      1     |   1  |   0  |   0  |   0  |  0  |
| 10   |    1  |      1     |   1  |   0  |   0  |   0  |  0  |
| 11   |    1  |      1     |   1  |   0  |   0  |   0  |  0  |
| 12   |    0  |      1     |   0  |   1  |   0  |   0  |  0  |
| 13   |    0  |      1     |   0  |   0  |   1  |   0  |  0  |
| 14   |    0  |      1     |   0  |   0  |   0  |   1  |  0  |
| 15   |    0  |      1     |   0  |   0  |   0  |   0  |  1  |
| 16   |    0  |      1     |   0  |   0  |   0  |   0  |  0  |
| 17   |    0  |      1     |   0  |   0  |   0  |   0  |  0  |
| 18   |    1  |      1     |   1  |   0  |   0  |   0  |  0  |
| 19   |    0  |      0     |   1  |   0  |   0  |   0  |  0  |
| 20   |    0  |      0     |   1  |   0  |   0  |   0  |  0  |
| 21   |    0  |      0     |   1  |   0  |   0  |   0  |  0  |
| 22   |    0  |      1     |   0  |   1  |   0  |   0  |  0  |
| 23   |    0  |      0     |   0  |   1  |   0  |   0  |  0  |
| 24   |    0  |      0     |   0  |   1  |   0  |   0  |  0  |
| 25   |    0  |      0     |   0  |   1  |   0  |   0  |  0  |
| 26   |    0  |      1     |   0  |   0  |   1  |   0  |  0  |
| 27   |    0  |      0     |   0  |   0  |   1  |   0  |  0  |
| 28   |    0  |      0     |   0  |   0  |   1  |   0  |  0  |
| 29   |    0  |      0     |   0  |   0  |   1  |   0  |  0  |
| 30   |    0  |      1     |   0  |   0  |   0  |   1  |  0  |
| 31   |    0  |      0     |   0  |   0  |   0  |   1  |  0  |
| 32   |    0  |      0     |   0  |   0  |   0  |   1  |  0  |
| 33   |    0  |      0     |   0  |   0  |   0  |   1  |  0  |
| 34   |    0  |      1     |   0  |   0  |   0  |   0  |  1  |
| 35   |    0  |      0     |   0  |   0  |   0  |   0  |  1  |
| 36   |    0  |      0     |   0  |   0  |   0  |   0  |  1  |
| 37   |    0  |      0     |   0  |   0  |   0  |   0  |  1  |
`);
