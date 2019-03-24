import { ChipDef } from '../components/ChipDef.mjs';

export const SixteenthClock = new ChipDef(`
CHIP SixteenthClock {
  IN clockIn;
  OUT half, quarter, eigth, sixteenth;

  PARTS:
  HalfClock(clockIn=clockIn, clockOut=c2);
  HalfClock(clockIn=c2, clockOut=c4);
  HalfClock(clockIn=c4, clockOut=c8);
  HalfClock(clockIn=c8, clockOut=sixteenth);
  Copy(in=c2, out=half);
  Copy(in=c4, out=quarter);
  Copy(in=c8, out=eigth);
}`);
