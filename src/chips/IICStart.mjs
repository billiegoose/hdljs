import { ChipDef } from '../components/ChipDef.mjs';

export const IICStart = new ChipDef(`
CHIP IICStart {
  IN clock0, reset, start;
  OUT sda, scl, done;

  PARTS:
  // |        | clock0 | clock1 | scl | sda |
  // | phase0 |    0   |    0   |  1  |  0  |
  // | phase1 |    1   |    0   |  1  |  0  |
  // | phase2 |    0   |    1   |  0  |  0  |
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
  And(a=clock0, b=active, out=activeClock);
  // Reset logic
  Or(a=reset, b=doneInternal, out=resetInternal);

  Copy(in=false, out=sda);
  // Catch trailing edge
  Blop(in=activeClock, out=clockFall);
  Or(a=clockFall, b=startRise, out=loadScl);
  FastBit(
    in=startRise,
    load=loadScl,
    reset=resetInternal,
    out=sclInternal
  );
  Copy(in=sclInternal, out=scl);

  Blop(in=sclInternal, out=sclFall);
  FastBit(
    in=true,
    load=sclFall,
    reset=resetInternal,
    slowOut=phase2
  );

  And(a=clockFall, b=phase2, out=finalPhase);
  Or(a=finalPhase, b=startRise, out=loadDone);
  FastBit(
    in=nstartRise,
    load=loadDone,
    reset=reset,
    out=doneInternal
  );
  Copy(in=doneInternal, out=done);
}
`).test(`
| time | clock0 | reset | start | sda | scl | done |
| 1    |    0   |   1   |   0   |  0  |  0  |   0  |
| 2    |    0   |   0   |   1   |  0  |  1  |   0  |
| 3    |    1   |   0   |   0   |  0  |  1  |   0  |
| 4    |    0   |   0   |   0   |  0  |  0  |   0  |
| 5    |    1   |   0   |   0   |  0  |  0  |   0  |
| 6    |    0   |   0   |   0   |  0  |  0  |   1  |
| 7    |    1   |   0   |   0   |  0  |  0  |   1  |
| 8    |    0   |   0   |   0   |  0  |  0  |   1  |
| 9    |    1   |   0   |   0   |  0  |  0  |   1  |
| 10   |    0   |   0   |   0   |  0  |  0  |   1  |
| 11   |    1   |   0   |   0   |  0  |  0  |   1  |
| 12   |    0   |   0   |   0   |  0  |  0  |   1  |
| 13   |    1   |   0   |   0   |  0  |  0  |   1  |
| 14   |    0   |   0   |   0   |  0  |  0  |   1  |
| 15   |    1   |   0   |   0   |  0  |  0  |   1  |
| 16   |    0   |   0   |   1   |  0  |  1  |   0  |
| 17   |    0   |   0   |   0   |  0  |  1  |   0  |
| 18   |    0   |   0   |   0   |  0  |  1  |   0  |
| 19   |    1   |   0   |   0   |  0  |  1  |   0  |
| 20   |    1   |   0   |   0   |  0  |  1  |   0  |
| 21   |    0   |   0   |   0   |  0  |  0  |   0  |
| 22   |    0   |   0   |   0   |  0  |  0  |   0  |
| 23   |    1   |   0   |   0   |  0  |  0  |   0  |
| 24   |    1   |   0   |   0   |  0  |  0  |   0  |
| 25   |    0   |   0   |   0   |  0  |  0  |   1  |
| 26   |    0   |   0   |   0   |  0  |  0  |   1  |
| 27   |    1   |   0   |   0   |  0  |  0  |   1  |
| 28   |    1   |   0   |   0   |  0  |  0  |   1  |
| 29   |    0   |   0   |   0   |  0  |  0  |   1  |
| 30   |    0   |   0   |   0   |  0  |  0  |   1  |
| 31   |    1   |   0   |   0   |  0  |  0  |   1  |
| 32   |    1   |   0   |   0   |  0  |  0  |   1  |
| 33   |    0   |   0   |   0   |  0  |  0  |   1  |
| 34   |    0   |   0   |   0   |  0  |  0  |   1  |
| 35   |    0   |   0   |   1   |  0  |  1  |   0  |
| 36   |    0   |   0   |   0   |  0  |  1  |   0  |
| 37   |    0   |   0   |   0   |  0  |  1  |   0  |
| 38   |    0   |   0   |   0   |  0  |  1  |   0  |
| 39   |    1   |   0   |   0   |  0  |  1  |   0  |
| 40   |    1   |   0   |   0   |  0  |  1  |   0  |
| 41   |    1   |   0   |   0   |  0  |  1  |   0  |
| 42   |    0   |   0   |   0   |  0  |  0  |   0  |
| 43   |    0   |   0   |   0   |  0  |  0  |   0  |
| 44   |    0   |   0   |   0   |  0  |  0  |   0  |
| 45   |    1   |   0   |   0   |  0  |  0  |   0  |
| 46   |    1   |   0   |   0   |  0  |  0  |   0  |
| 47   |    1   |   0   |   0   |  0  |  0  |   0  |
| 48   |    0   |   0   |   0   |  0  |  0  |   1  |
| 49   |    0   |   0   |   0   |  0  |  0  |   1  |
| 50   |    0   |   0   |   0   |  0  |  0  |   1  |
| 51   |    1   |   0   |   0   |  0  |  0  |   1  |
| 52   |    1   |   0   |   0   |  0  |  0  |   1  |
| 53   |    1   |   0   |   0   |  0  |  0  |   1  |
| 54   |    0   |   0   |   0   |  0  |  0  |   1  |
| 55   |    0   |   0   |   0   |  0  |  0  |   1  |
| 56   |    0   |   0   |   0   |  0  |  0  |   1  |
| 57   |    1   |   0   |   0   |  0  |  0  |   1  |
| 58   |    1   |   0   |   0   |  0  |  0  |   1  |
| 59   |    1   |   0   |   0   |  0  |  0  |   1  |
| 60   |    0   |   0   |   0   |  0  |  0  |   1  |
| 61   |    0   |   0   |   0   |  0  |  0  |   1  |
| 62   |    0   |   0   |   0   |  0  |  0  |   1  |
`);