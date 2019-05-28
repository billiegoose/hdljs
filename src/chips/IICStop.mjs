import { ChipDef } from '../components/ChipDef.mjs';

export const IICStop = new ChipDef(`
CHIP IICStop {
  IN clock0, reset;
  OUT sda, scl, done;

  PARTS:
  HalfClock(
    clockIn=clock0,
    reset=reset,
    clockOut=clock1
  );
  // |        | clock0 | clock1 | scl | sda |
  // | phase0 |    0   |    0   |  1  |  0  |
  // | phase1 |    1   |    0   |  1  |  0  |
  // | phase2 |    0   |    1   |  1  |  1  |
  // | phase3 |    1   |    1   |  1  |  1  |

  // Generate the IIC "stop" condition
  Not(in=doneInternal, out=ndone);
  And(a=true, b=ndone, out=scl);
  And(a=clock1, b=ndone, out=sda);
  
  // Done-ness logic
  Not(in=reset, out=nreset);
  And(a=clock0, b=clock1, out=clock01);
  Blop(in=clock01, out=rollover);
  Or(a=reset, b=rollover, out=setDone);
  FastBit(in=nreset, load=setDone, out=done, slowOut=doneInternal);
}
`).test(`
| time |   clock0   | reset | sda | scl |done |
| 1    |      0     |   1   |  0  |  1  |  0  |
| 2    |      1     |   0   |  0  |  1  |  0  |
| 3    |      0     |   0   |  1  |  1  |  0  |
| 4    |      1     |   0   |  1  |  1  |  0  |
| 5    |      0     |   0   |  0  |  0  |  1  |
| 6    |      1     |   0   |  0  |  0  |  1  |
| 7    |      0     |   0   |  0  |  0  |  1  |
| 8    |      1     |   0   |  0  |  0  |  1  |
| 9    |      0     |   0   |  0  |  0  |  1  |
| 10   |      1     |   0   |  0  |  0  |  1  |
| 11   |      0     |   0   |  0  |  0  |  1  |
| 12   |      1     |   0   |  0  |  0  |  1  |
| 13   |      0     |   0   |  0  |  0  |  1  |
| 14   |      1     |   0   |  0  |  0  |  1  |
| 15   |      0     |   0   |  0  |  0  |  1  |
| 16   |      1     |   0   |  0  |  0  |  1  |
| 17   |      0     |   0   |  0  |  0  |  1  |
| 18   |      1     |   0   |  0  |  0  |  1  |
| 19   |      0     |   0   |  0  |  0  |  1  |
| 20   |      1     |   0   |  0  |  0  |  1  |
| 21   |      0     |   0   |  0  |  0  |  1  |
| 22   |      1     |   0   |  0  |  0  |  1  |
| 23   |      0     |   0   |  0  |  0  |  1  |
| 24   |      1     |   0   |  0  |  0  |  1  |
| 25   |      0     |   0   |  0  |  0  |  1  |
| 26   |      1     |   0   |  0  |  0  |  1  |
| 27   |      0     |   0   |  0  |  0  |  1  |
| 28   |      1     |   0   |  0  |  0  |  1  |
| 29   |      0     |   0   |  0  |  0  |  1  |
| 30   |      1     |   0   |  0  |  0  |  1  |
| 31   |      0     |   0   |  0  |  0  |  1  |
| 32   |      1     |   0   |  0  |  0  |  1  |
| 33   |      0     |   1   |  0  |  1  |  0  |
| 34   |      1     |   0   |  0  |  1  |  0  |
| 35   |      0     |   0   |  1  |  1  |  0  |
| 36   |      1     |   0   |  1  |  1  |  0  |
| 37   |      0     |   0   |  0  |  0  |  1  |
| 38   |      1     |   0   |  0  |  0  |  1  |
| 39   |      0     |   0   |  0  |  0  |  1  |
| 40   |      1     |   0   |  0  |  0  |  1  |
| 41   |      0     |   0   |  0  |  0  |  1  |
| 42   |      1     |   0   |  0  |  0  |  1  |
| 43   |      0     |   0   |  0  |  0  |  1  |
| 44   |      1     |   0   |  0  |  0  |  1  |
| 45   |      0     |   0   |  0  |  0  |  1  |
| 46   |      1     |   0   |  0  |  0  |  1  |
| 47   |      0     |   0   |  0  |  0  |  1  |
| 48   |      1     |   0   |  0  |  0  |  1  |
| 49   |      0     |   0   |  0  |  0  |  1  |
| 50   |      1     |   0   |  0  |  0  |  1  |
| 51   |      0     |   0   |  0  |  0  |  1  |
| 52   |      1     |   0   |  0  |  0  |  1  |
| 53   |      0     |   0   |  0  |  0  |  1  |
| 54   |      1     |   0   |  0  |  0  |  1  |
| 55   |      0     |   0   |  0  |  0  |  1  |
| 56   |      1     |   0   |  0  |  0  |  1  |
| 57   |      0     |   0   |  0  |  0  |  1  |
| 58   |      1     |   0   |  0  |  0  |  1  |
| 59   |      0     |   0   |  0  |  0  |  1  |
| 60   |      1     |   0   |  0  |  0  |  1  |
| 61   |      0     |   0   |  0  |  0  |  1  |
| 62   |      1     |   0   |  0  |  0  |  1  |
| 63   |      0     |   0   |  0  |  0  |  1  |
| 64   |      1     |   0   |  0  |  0  |  1  |
`);