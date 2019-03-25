import { ChipDef } from '../components/ChipDef.mjs';

export const SixteenthClock = new ChipDef(`
CHIP SixteenthClock {
  IN clockIn, reset;
  OUT half, quarter, eigth, sixteenth;

  PARTS:
  HalfClock(clockIn=clockIn, reset=reset, clockOut=c2);
  HalfClock(clockIn=c2, reset=reset, clockOut=c4);
  HalfClock(clockIn=c4, reset=reset, clockOut=c8);
  HalfClock(clockIn=c8, reset=reset, clockOut=sixteenth);
  Copy(in=c2, out=half);
  Copy(in=c4, out=quarter);
  Copy(in=c8, out=eigth);
}
`);
