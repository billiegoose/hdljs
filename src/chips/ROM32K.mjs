import { ChipDef } from '../components/ChipDef.mjs';

export const ROM32K = new ChipDef(`
CHIP ROM32K {
  IN load, address[14], in[16];
  OUT out[16];
}
`);
