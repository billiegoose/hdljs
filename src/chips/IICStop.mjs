import { ChipDef } from '../components/ChipDef.mjs';

export const IICStop = new ChipDef(`
CHIP IICStop {
  IN clock0, reset;
  OUT sda, scl;

  PARTS:
  SixteenthClock(
    clockIn=clock0,
    reset=reset,
    half=clock1,
    quarter=clock2,
    eigth=clock3,
    sixteenth=clock4
  );
  // |        | clock0 | clock1 | scl | sda |
  // | phase0 |    0   |    0   |  1  |  0  |
  // | phase1 |    1   |    0   |  1  |  0  |
  // | phase2 |    0   |    1   |  1  |  1  |
  // | phase3 |    1   |    1   |  1  |  1  |

  // We only care about the 1st bit-cycle
  Or(a=clock2, b=clock3, out=clock23);
  Nor(a=clock23, b=clock4, out=clock234);

  // Generate the IIC "stop" condition
  Copy(in=true, out=scl);
  Mux(sel=clock234, a=true, b=clock1, out=sda);
}
`).test(`
| time |   clock0   | sda | scl |
| 1    |      0     |  0  |  1  |
| 2    |      1     |  0  |  1  |
| 3    |      0     |  1  |  1  |
| 4    |      1     |  1  |  1  |
| 5    |      0     |  1  |  1  |
| 6    |      1     |  1  |  1  |
| 7    |      0     |  1  |  1  |
| 8    |      1     |  1  |  1  |
| 9    |      0     |  1  |  1  |
| 10   |      1     |  1  |  1  |
| 11   |      0     |  1  |  1  |
| 12   |      1     |  1  |  1  |
| 13   |      0     |  1  |  1  |
| 14   |      1     |  1  |  1  |
| 15   |      0     |  1  |  1  |
| 16   |      1     |  1  |  1  |
| 17   |      0     |  1  |  1  |
| 18   |      1     |  1  |  1  |
| 19   |      0     |  1  |  1  |
| 20   |      1     |  1  |  1  |
| 21   |      0     |  1  |  1  |
| 22   |      1     |  1  |  1  |
| 23   |      0     |  1  |  1  |
| 24   |      1     |  1  |  1  |
| 25   |      0     |  1  |  1  |
| 26   |      1     |  1  |  1  |
| 27   |      0     |  1  |  1  |
| 28   |      1     |  1  |  1  |
| 29   |      0     |  1  |  1  |
| 30   |      1     |  1  |  1  |
| 31   |      0     |  1  |  1  |
| 32   |      1     |  1  |  1  |
| 33   |      0     |  0  |  1  |
| 34   |      1     |  0  |  1  |
| 35   |      0     |  1  |  1  |
| 36   |      1     |  1  |  1  |
| 37   |      0     |  1  |  1  |
| 38   |      1     |  1  |  1  |
| 39   |      0     |  1  |  1  |
| 40   |      1     |  1  |  1  |
| 41   |      0     |  1  |  1  |
| 42   |      1     |  1  |  1  |
| 43   |      0     |  1  |  1  |
| 44   |      1     |  1  |  1  |
| 45   |      0     |  1  |  1  |
| 46   |      1     |  1  |  1  |
| 47   |      0     |  1  |  1  |
| 48   |      1     |  1  |  1  |
| 49   |      0     |  1  |  1  |
| 50   |      1     |  1  |  1  |
| 51   |      0     |  1  |  1  |
| 52   |      1     |  1  |  1  |
| 53   |      0     |  1  |  1  |
| 54   |      1     |  1  |  1  |
| 55   |      0     |  1  |  1  |
| 56   |      1     |  1  |  1  |
| 57   |      0     |  1  |  1  |
| 58   |      1     |  1  |  1  |
| 59   |      0     |  1  |  1  |
| 60   |      1     |  1  |  1  |
| 61   |      0     |  1  |  1  |
| 62   |      1     |  1  |  1  |
| 63   |      0     |  1  |  1  |
| 64   |      1     |  1  |  1  |
`);
