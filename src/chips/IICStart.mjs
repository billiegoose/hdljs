import { ChipDef } from '../components/ChipDef.mjs';

export const IICStart = new ChipDef(`
CHIP IICStart {
  IN clock0, reset;
  OUT sda, scl, done;

  PARTS:
  Copy(in=false, out=sda);
  // Catch trailing edge
  Blop(in=clock0, out=clockFall);
  FastBit(
    in=true,
    load=clockFall,
    reset=reset,
    out=nscl
  );
  Not(in=nscl, out=sclInternal);
  Copy(in=sclInternal, out=scl);

  Blop(in=sclInternal, out=sclFall);
  FastBit(
    in=true,
    load=sclFall,
    reset=reset,
    slowOut=phase2
  );

  And(a=clockFall, b=phase2, out=finalPhase);
  FastBit(
    in=true,
    load=finalPhase,
    reset=reset,
    out=done
  );

  // |        | clock0 | clock1 | scl | sda |
  // | en=0   |    X   |    X   |  0  |  0  |
  // | phase0 |    0   |    0   |  1  |  0  |
  // | phase1 |    1   |    0   |  1  |  0  |
  // | phase2 |    0   |    1   |  0  |  0  |
  // | phase3 |    1   |    1   |  0  |  0  |
}
`).test(`
| time |   clock0   | reset | sda | scl |done |
| 1    |      0     |   1   |  0  |  1  |  0  |
| 2    |      1     |   0   |  0  |  1  |  0  |
| 3    |      0     |   0   |  0  |  0  |  0  |
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
| 15   |      0     |   1   |  0  |  1  |  0  |
| 16   |      0     |   0   |  0  |  1  |  0  |
| 17   |      0     |   0   |  0  |  1  |  0  |
| 18   |      1     |   0   |  0  |  1  |  0  |
| 19   |      1     |   0   |  0  |  1  |  0  |
| 20   |      0     |   0   |  0  |  0  |  0  |
| 21   |      0     |   0   |  0  |  0  |  0  |
| 22   |      1     |   0   |  0  |  0  |  0  |
| 23   |      1     |   0   |  0  |  0  |  0  |
| 24   |      0     |   0   |  0  |  0  |  1  |
| 25   |      0     |   0   |  0  |  0  |  1  |
| 26   |      1     |   0   |  0  |  0  |  1  |
| 27   |      1     |   0   |  0  |  0  |  1  |
| 28   |      0     |   0   |  0  |  0  |  1  |
| 29   |      0     |   0   |  0  |  0  |  1  |
| 30   |      1     |   0   |  0  |  0  |  1  |
| 31   |      1     |   0   |  0  |  0  |  1  |
| 32   |      0     |   0   |  0  |  0  |  1  |
| 33   |      0     |   0   |  0  |  0  |  1  |
| 34   |      0     |   1   |  0  |  1  |  0  |
| 35   |      0     |   0   |  0  |  1  |  0  |
| 36   |      0     |   0   |  0  |  1  |  0  |
| 37   |      0     |   0   |  0  |  1  |  0  |
| 38   |      1     |   0   |  0  |  1  |  0  |
| 39   |      1     |   0   |  0  |  1  |  0  |
| 40   |      1     |   0   |  0  |  1  |  0  |
| 41   |      0     |   0   |  0  |  0  |  0  |
| 42   |      0     |   0   |  0  |  0  |  0  |
| 43   |      0     |   0   |  0  |  0  |  0  |
| 44   |      1     |   0   |  0  |  0  |  0  |
| 45   |      1     |   0   |  0  |  0  |  0  |
| 46   |      1     |   0   |  0  |  0  |  0  |
| 47   |      0     |   0   |  0  |  0  |  1  |
| 48   |      0     |   0   |  0  |  0  |  1  |
| 49   |      0     |   0   |  0  |  0  |  1  |
| 50   |      1     |   0   |  0  |  0  |  1  |
| 51   |      1     |   0   |  0  |  0  |  1  |
| 52   |      1     |   0   |  0  |  0  |  1  |
| 53   |      0     |   0   |  0  |  0  |  1  |
| 54   |      0     |   0   |  0  |  0  |  1  |
| 55   |      0     |   0   |  0  |  0  |  1  |
| 56   |      1     |   0   |  0  |  0  |  1  |
| 57   |      1     |   0   |  0  |  0  |  1  |
| 58   |      1     |   0   |  0  |  0  |  1  |
| 59   |      0     |   0   |  0  |  0  |  1  |
| 60   |      0     |   0   |  0  |  0  |  1  |
| 61   |      0     |   0   |  0  |  0  |  1  |
`);