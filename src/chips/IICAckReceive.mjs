import { ChipDef } from '../components/ChipDef.mjs';

export const IICAckReceive = new ChipDef(`
CHIP IICAckReceive {
  IN clock0, reset, start;
  OUT sda, scl, done;

  PARTS:
  // |        | clock0 | clock1 | scl | sda |
  // | phase0 |    0   |    0   |  0  |  0  |
  // | phase1 |    1   |    0   |  1  |  0  |
  // | phase2 |    0   |    1   |  1  |  0  |
  // | phase3 |    1   |    1   |  0  |  0  |

  // Start logic
  Blip(in=start, out=startRise);
  Not(in=startRise, out=nstartRise);
  FastBit(
    in=startRise,
    load=startRise,
    reset=reset,
    out=active
  );
  // Reset logic
  Or(a=reset, b=startRise, out=resetClock);
  HalfClock(
    clockIn=clock0,
    reset=resetClock,
    clockOut=clock1
  );

  And(a=clock0, b=ndone, out=activeClock0);
  And(a=clock1, b=ndone, out=activeClock1);

  // Set sda to 'z'
  HighImpedence(out=sdaInternal);
  And(a=sdaInternal, b=ndone, out=sda);
  
  // Pulse clock
  Xor(a=activeClock0, b=activeClock1, out=sclInternal);
  Copy(in=sclInternal, out=scl);

  // Done-ness logic
  And(a=clock0, b=clock1, out=finalPhase);
  Blop(in=finalPhase, out=loadDone);
  FastBit(
    in=nstartRise,
    load=loadDone,
    reset=reset,
    out=doneInternal
  );
  Copy(in=doneInternal, out=done);
  Not(in=doneInternal, out=ndone);
}
`).test(`
| time | clock0 | reset | start | sda | scl |done |
| 1    |    0   |   1   |   0   |  0  |  0  |  0  |
| 2    |    0   |   0   |   1   |  0  |  0  |  0  |
| 3    |    1   |   0   |   0   |  0  |  1  |  0  |
| 4    |    0   |   0   |   0   |  0  |  1  |  0  |
| 5    |    1   |   0   |   0   |  0  |  0  |  0  |
| 6    |    0   |   0   |   0   |  0  |  0  |  1  |
| 7    |    1   |   0   |   0   |  0  |  0  |  1  |
| 8    |    0   |   0   |   0   |  0  |  0  |  1  |
| 9    |    1   |   0   |   0   |  0  |  0  |  1  |
| 10   |    0   |   0   |   0   |  0  |  0  |  1  |
| 11   |    1   |   0   |   0   |  0  |  0  |  1  |
| 12   |    0   |   0   |   0   |  0  |  0  |  1  |
| 13   |    1   |   0   |   0   |  0  |  0  |  1  |
| 14   |    0   |   0   |   0   |  0  |  0  |  1  |
| 15   |    1   |   0   |   0   |  0  |  0  |  1  |
| 16   |    0   |   0   |   0   |  0  |  0  |  1  |
| 17   |    1   |   0   |   0   |  0  |  0  |  1  |
| 18   |    0   |   0   |   1   |  0  |  0  |  0  |
| 19   |    0   |   0   |   0   |  0  |  0  |  0  |
| 20   |    1   |   0   |   0   |  0  |  1  |  0  |
| 21   |    1   |   0   |   0   |  0  |  1  |  0  |
| 22   |    0   |   0   |   0   |  0  |  1  |  0  |
| 23   |    0   |   0   |   0   |  0  |  1  |  0  |
| 24   |    1   |   0   |   0   |  0  |  0  |  0  |
| 25   |    1   |   0   |   0   |  0  |  0  |  0  |
| 26   |    0   |   0   |   0   |  0  |  0  |  1  |
| 27   |    0   |   0   |   0   |  0  |  0  |  1  |
| 28   |    1   |   0   |   0   |  0  |  0  |  1  |
| 29   |    1   |   0   |   0   |  0  |  0  |  1  |
| 30   |    0   |   0   |   0   |  0  |  0  |  1  |
| 31   |    0   |   0   |   0   |  0  |  0  |  1  |
| 32   |    1   |   0   |   0   |  0  |  0  |  1  |
| 33   |    1   |   0   |   0   |  0  |  0  |  1  |
| 34   |    0   |   0   |   0   |  0  |  0  |  1  |
| 35   |    0   |   0   |   0   |  0  |  0  |  1  |
| 36   |    1   |   0   |   0   |  0  |  0  |  1  |
| 37   |    1   |   0   |   0   |  0  |  0  |  1  |
| 38   |    0   |   0   |   0   |  0  |  0  |  1  |
| 39   |    0   |   0   |   0   |  0  |  0  |  1  |
| 40   |    1   |   0   |   0   |  0  |  0  |  1  |
| 41   |    1   |   0   |   0   |  0  |  0  |  1  |
| 42   |    0   |   0   |   0   |  0  |  0  |  1  |
| 43   |    0   |   0   |   0   |  0  |  0  |  1  |
| 44   |    1   |   0   |   0   |  0  |  0  |  1  |
| 45   |    1   |   0   |   0   |  0  |  0  |  1  |
| 46   |    0   |   0   |   0   |  0  |  0  |  1  |
| 47   |    0   |   0   |   0   |  0  |  0  |  1  |
| 48   |    1   |   0   |   0   |  0  |  0  |  1  |
| 49   |    1   |   0   |   0   |  0  |  0  |  1  |
`)
