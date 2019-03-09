import { ChipDef } from "../components/ChipDef.mjs"

export const Screen = new ChipDef(`
CHIP Screen {
  IN load, address[13], in[16];
  OUT out[16];
}`)
