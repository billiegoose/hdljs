import { ChipDef } from '../components/ChipDef.mjs';

export const EigthClock = new ChipDef(`
CHIP EigthClock {
  IN clockIn, reset;
  OUT half, quarter, eigth;

  PARTS:
  HalfClock(clockIn=clockIn, reset=reset, clockOut=c2);
  HalfClock(clockIn=c2, reset=reset, clockOut=c4);
  HalfClock(clockIn=c4, reset=reset, clockOut=eigth);
  Copy(in=c2, out=half);
  Copy(in=c4, out=quarter);
}
`);
