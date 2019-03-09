import { ChipDef } from '../components/ChipDef.mjs';

export const ROM32K = new ChipDef(`
CHIP ROM32K {
  IN address[14];
  OUT out[16];
}
`);
