import { ChipDef } from '../components/ChipDef.mjs';

export const IICByte = new ChipDef(`
CHIP IICByte {
  IN clock0, in[8], reset;
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

  // |           | clock0 | clock1 | scl | sda |
  // | substate0 |    0   |    0   |  0  |  b  |
  // | substate1 |    1   |    0   |  1  |  b  |
  // | substate2 |    0   |    1   |  1  |  b  |
  // | substate3 |    1   |    1   |  0  |  b  |
  Xor(a=clock0, b=clock1, out=scl);
  // Since we want to send them in MSB -> LSB order,
  // we need to reverse them
  // 000 -> 111
  // 001 -> 110
  // 010 -> 101
  // 011 -> 100
  // 100 -> 011
  // 101 -> 010
  // 110 -> 001
  // 111 -> 000
  Not(in=clock2, out=bit0);
  Not(in=clock3, out=bit1);
  Not(in=clock4, out=bit2);
  Mux8Way(
    sel[0]=bit0,
    sel[1]=bit1,
    sel[2]=bit2,
    in=in,
    out=sda
  );
}
`);
