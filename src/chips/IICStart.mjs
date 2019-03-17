import { ChipDef } from '../components/ChipDef.mjs';

export const IICStart = new ChipDef(`
CHIP IICStart {
  IN pulseClock, begin;
  OUT sda, scl, ready;

  PARTS:
  // State machine
  Blip(in=begin, out=state0);
  Bit(in=state0, load=pulseClock, out=state1);
  Bit(in=state1, load=pulseClock, out=state2);
  // | state | idle | state1 | state2 |
  // | scl   | 1    |   1    |   0    |
  // | sda   | 1    |   0    |   0    |

  Or(a=state1, b=state2, out=active);
  Not(in=active, out=ready);

  Not(in=active, out=sda);
  Not(in=state2, out=scl);
}`).test(`
| time | pulseClock | begin | sda | scl | ready |
| 0+   |      1     |   0   |  1  |  1  |   1   |
| 1    |      1     |   0   |  1  |  1  |   1   |
| 1+   |      1     |   0   |  1  |  1  |   1   |
| 2    |      1     |   0   |  1  |  1  |   1   |
| 2+   |      1     |   1   |  1  |  1  |   1   |
| 3    |      1     |   1   |  0  |  1  |   0   |
| 3+   |      1     |   0   |  0  |  1  |   0   |
| 4    |      1     |   0   |  0  |  0  |   0   |
| 4+   |      1     |   0   |  0  |  0  |   0   |
| 5    |      1     |   0   |  1  |  1  |   1   |
| 5+   |      1     |   0   |  1  |  1  |   1   |
| 6    |      1     |   0   |  1  |  1  |   1   |
| 6+   |      1     |   0   |  1  |  1  |   1   |
| 7    |      1     |   0   |  1  |  1  |   1   |
| 7+   |      1     |   0   |  1  |  1  |   1   |
| 8    |      1     |   0   |  1  |  1  |   1   |
| 8+   |      1     |   0   |  1  |  1  |   1   |
| 9    |      1     |   0   |  1  |  1  |   1   |
| 9+   |      1     |   0   |  1  |  1  |   1   |
| 10   |      1     |   0   |  1  |  1  |   1   |
| 10+  |      1     |   0   |  1  |  1  |   1   |
| 11   |      1     |   0   |  1  |  1  |   1   |
| 11+  |      1     |   1   |  1  |  1  |   1   |
| 12   |      1     |   1   |  0  |  1  |   0   |
| 12+  |      1     |   1   |  0  |  1  |   0   |
| 13   |      1     |   1   |  0  |  0  |   0   |
| 13+  |      1     |   1   |  0  |  0  |   0   |
| 14   |      1     |   1   |  1  |  1  |   1   |
| 14+  |      1     |   0   |  1  |  1  |   1   |
| 15   |      1     |   0   |  1  |  1  |   1   |
| 15+  |      1     |   0   |  1  |  1  |   1   |
| 16   |      1     |   0   |  1  |  1  |   1   |
| 16+  |      1     |   0   |  1  |  1  |   1   |
| 17   |      1     |   0   |  1  |  1  |   1   |
| 17+  |      1     |   0   |  1  |  1  |   1   |
| 18   |      1     |   0   |  1  |  1  |   1   |
`);
