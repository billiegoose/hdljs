import { ChipDef } from '../components/ChipDef.mjs';

export const ROM32KLessAnnoying = new ChipDef(`
CHIP ROM32KLessAnnoying {
  IN address[16];
  OUT out[16];
  PARTS:
  ROM32K(address=address[0..14], out=out);
}
`);
