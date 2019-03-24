import { ChipDef } from '../components/ChipDef.mjs';

export const IICByte = new ChipDef(`
CHIP IICByte {
  IN clock0, in[8];
  OUT sda, scl;

  PARTS:
  SixteenthClock(
    clockIn=clock0,
    half=clock1,
    quarter=clock2,
    eigth=clock3,
    sixteenth=clock4
  );

  // |           | clock0 | clock1 | scl | sda |
  // | substate0 |    1   |    1   |  0  |  b  |
  // | substate1 |    0   |    1   |  1  |  b  |
  // | substate2 |    1   |    0   |  1  |  b  |
  // | substate3 |    0   |    0   |  0  |  b  |
  Xor(a=clock0, b=clock1, out=scl);
  Mux8Way(
    sel[0]=clock2,
    sel[1]=clock3,
    sel[2]=clock4,
    in=in,
    out=sda
  );
}
`);
