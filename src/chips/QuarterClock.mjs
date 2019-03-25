import { ChipDef } from '../components/ChipDef.mjs';

export const QuarterClock = new ChipDef(`
CHIP QuarterClock {
  IN clockIn, reset;
  OUT half, quarter;

  PARTS:
  HalfClock(clockIn=clockIn, reset=reset, clockOut=c2);
  HalfClock(clockIn=c2, reset=reset, clockOut=quarter);
  Copy(in=c2, out=half);
}
`);
