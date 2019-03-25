import { ChipDef } from '../components/ChipDef.mjs';

export const IICTransmitRange = new ChipDef(`
CHIP IICTransmitRange {
  IN reset, startAt[16], stopAt[16], sendStart, sendStop;
  OUT address[16], sda, scl;
  PARTS:
  // we want to target a transmission speed of 100 kbit/s
  // 100kbit/s is 12500 byte/s
  // the clock speed is 25MHz
  // (25,000,000 clock cycles / 1s) * (1s / 12500 bytes) = 2000 cycles / byte
  // Each byte has 8 bits and each bit as 4 iic phases so 
  // 2000 cycles / byte * 32 iic cycles / byte
  // = 62.5 which we'll round to 62
  // 62 = 0011 1110
  // The ClockDivider "max" value is actually 1/2 the period so we want
  // 31 = 0001 1111
  ClockDivider(
    reset=blipReset,
    max[0]=false,
    max[1]=true,
    max[2]=true,
    max[3]=true,
    max[4]=true,
    max[5]=true,
    out=clock0
  );
  QuarterClock(
    clockIn=clock0,
    reset=blipReset,
    quarter=bitClock
  );
  EigthClock(
    clockIn=bitClock,
    reset=blipReset,
    quarter=halfbyteClock,
    eigth=byteClock
  );
  HalfClock(
    clockIn=byteClock,
    reset=blipReset,
    clockOut=wordClock
  );

  // State for start and stop conditions.
  Equal(a=pc, b=startAt, out=atStart);
  Equal(a=pc, b=stopAt, out=atStop);
  And(a=atStart, b=sendStart, out=sendingStart);
  And(a=atStop,  b=sendStop,  out=sendingStop);

  // When to increment the address counter
  Blop(in=byteClock, out=incClock);
  Not(in=atStop, out=countUp);
  And(a=countUp, b=incClock, out=inc);

  // Trigger to start sending message
  Blip(in=reset, out=blipReset);

  // The address counter
  PC(inc=inc, in=startAt, load=blipReset, out=pc);

  // The final idle state
  Blip(in=halfbyteClock, out=finalClock);
  Or(a=blipReset, b=finalClock, out=loadFinal);
  Mux(sel=blipReset, a=sendingStop, b=false, out=done0);
  FastBit(in=done0, load=loadFinal, out=done);

  // Select the byte to send
  ROM32KLessAnnoying(address=pc, out[0..7]=byte2, out[8..15]=byte1);
  Mux16(a[0..7]=byte1, b[0..7]=byte2, sel=byteClock, out[0..7]=byte);

  // Generate SDA and SCL signals
  IICStart(
    clock0=clock0,
    reset=blipReset,
    sda=sdaStart,
    scl=sclStart
  );
  Not(in=byteClock, out=nbyteClock);
  Or(a=sdaStart, b=nbyteClock, out=sda0);
  Or(a=sclStart, b=nbyteClock, out=scl0);
  IICByte(
    clock0=clock0,
    reset=blipReset,
    in=byte,
    sda=sda1,
    scl=scl1
  );
  IICStop(
    clock0=clock0,
    reset=blipReset,
    sda=sdaStop,
    scl=sclStop
  );
  Or(a=sdaStop, b=byteClock, out=sda2);
  Or(a=sclStop, b=byteClock, out=scl2);

  // Handle whether to send the start condition, the byte at the 'pc' address, or the stop condition
  Mux(sel=sendingStart, a=sda1, b=sda0, out=sda01);
  Mux(sel=sendingStart, a=scl1, b=scl0, out=scl01);
  Mux(sel=sendingStop, a=sda01, b=sda2, out=sda012);
  Mux(sel=sendingStop, a=scl01, b=scl2, out=scl012);
  Mux(sel=done, a=sda012, b=true, out=sda);
  Mux(sel=done, a=scl012, b=true, out=scl);

  // For debugging fun
  Copy(in=pc, out=address);
}
`);
