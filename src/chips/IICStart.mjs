import { ChipDef } from '../components/ChipDef.mjs';

export const IICStart = new ChipDef(`
CHIP IICStart {
  IN clock0, reset;
  OUT sda, scl, done;

  PARTS:
  Copy(in=false, out=sda);
  // Catch trailing edge
  Blop(in=clock0, out=clockFall);
  FastBit(
    in=true,
    load=clockFall,
    reset=reset,
    out=nscl
  );
  Not(in=nscl, out=sclInternal);
  Copy(in=sclInternal, out=scl);

  Blop(in=sclInternal, out=sclFall);
  FastBit(
    in=true,
    load=sclFall,
    reset=reset,
    slowOut=phase2
  );

  And(a=clockFall, b=phase2, out=finalPhase);
  FastBit(
    in=true,
    load=finalPhase,
    reset=reset,
    out=done
  );
}
`);
