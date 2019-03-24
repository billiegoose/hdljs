import { ChipDef } from '../components/ChipDef.mjs';

export const IICDumpLoop = new ChipDef(`
CHIP IICDumpLoop {
  IN reset;
  OUT sda, scl;
  PARTS:
  // we want to target a transmission speed of 100 kbit/s
  // 100kbit/s is 12500 byte/s
  // the clock speed is 25MHz
  // (25,000,000 clock cycles / 1s) * (1s / 12500 bytes) = 2000 cycles / byte
  // Each byte has 8 bits and each bit as 4 iic phases so 
  // 2000 cycles / byte * 32 iic cycles / byte
  // = 62.5 which we'll round to 62
  // The ClockDivider "max" value is actually 1/2 the period so we want
  // 31 = 0001 1111
  ClockDivider(
    reset=reset,
    max[0]=true,
    max[1]=true,
    max[2]=true,
    max[3]=true,
    max[4]=true,
    out=phaseClock
  );
  IICByte(
    clock0=phaseClock,
    in=byte,
    sda=sda,
    scl=scl
  );
  QuarterClock(
    clockIn=phaseClock,
    quarter=bitClock
  );
  EigthClock(
    clockIn=bitClock,
    eigth=byteClock
  );
  HalfClock(clockIn=byteClock, clockOut=wordClock);
  Blip(in=wordClock, out=blipUp);
  Not(in=wordClock, out=notWordClock);
  Blip(in=notWordClock, out=blipDown);
  Or(a=blipUp, b=blipDown, out=inc);
  PC(inc=inc, reset=restart, out[0..14]=pc);
  ROM32K(address=pc, out[0..7]=byte1, out[8..15]=byte2);
  Mux16(a[0..7]=byte1, b[0..7]=byte2, sel=wordClock, out[0..7]=byte);

  // For now we'll loop over the same 139 bytes
  // correction - 70 words
  Equal(
    a[0..14]=pc,
    b[0]=false,
    b[1]=true,
    b[2]=true,
    b[3]=false,
    b[4]=false,
    b[5]=false,
    b[6]=true,
    b[7]=false,
    out=gotoStart
  );
  Or(a=reset, b=gotoStart, out=restart);
}`);
