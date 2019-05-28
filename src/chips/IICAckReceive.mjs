import { ChipDef } from '../components/ChipDef.mjs';

export const IICAckReceive = new ChipDef(`
CHIP IICAckReceive {
  IN clock0, reset;
  OUT sda, scl, done;

  PARTS:
  HalfClock(
    clockIn=clock0,
    reset=reset,
    clockOut=clock1
  );
  // |        | clock0 | clock1 | scl | sda |
  // | phase0 |    0   |    0   |  0  |  0  |
  // | phase1 |    1   |    0   |  1  |  0  |
  // | phase2 |    0   |    1   |  1  |  0  |
  // | phase3 |    1   |    1   |  0  |  0  |

  // Set sda to 'z' and pulse clock
  Xor(a=clock0, b=clock1, out=sclInternal);
  Not(in=doneInternal, out=ndone);
  And(a=sclInternal, b=ndone, out=scl);

  HighImpedence(out=sdaInternal);
  And(a=sdaInternal, b=ndone, out=sda);

  // Done-ness logic
  Not(in=reset, out=nreset);
  And(a=clock0, b=clock1, out=clock01);
  Blop(in=clock01, out=rollover);
  Or(a=reset, b=rollover, out=setDone);
  FastBit(in=nreset, load=setDone, out=done, slowOut=doneInternal);
}
`).test(`
| time |   clock0   | reset | sda | scl |done |
| 1    |      0     |   1   |  0  |  0  |  0  |
| 2    |      1     |   0   |  0  |  1  |  0  |
| 3    |      0     |   0   |  0  |  1  |  0  |
| 4    |      1     |   0   |  0  |  0  |  0  |
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
| 17   |      0     |   1   |  0  |  0  |  0  |
| 18   |      1     |   0   |  0  |  1  |  0  |
| 19   |      0     |   0   |  0  |  1  |  0  |
| 20   |      1     |   0   |  0  |  0  |  0  |
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
`)
