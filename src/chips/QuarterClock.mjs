import { ChipDef } from '../components/ChipDef.mjs';

export const QuarterClock = new ChipDef(`
CHIP QuarterClock {
  IN clockIn;
  OUT half, quarter;

  PARTS:
  HalfClock(clockIn=clockIn, clockOut=c2);
  HalfClock(clockIn=c2, clockOut=quarter);
  Copy(in=c2, out=half);
}`);
