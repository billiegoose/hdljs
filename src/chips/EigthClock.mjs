import { ChipDef } from '../components/ChipDef.mjs';

export const EigthClock = new ChipDef(`
CHIP EigthClock {
  IN clockIn;
  OUT half, quarter, eigth;

  PARTS:
  HalfClock(clockIn=clockIn, clockOut=c2);
  HalfClock(clockIn=c2, clockOut=c4);
  HalfClock(clockIn=c4, clockOut=eigth);
  Copy(in=c2, out=half);
  Copy(in=c4, out=quarter);
}`);
