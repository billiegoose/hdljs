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
`);
