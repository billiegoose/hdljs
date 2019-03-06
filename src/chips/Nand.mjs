import { ChipDef } from '../components/ChipDef.mjs';

export const Nand = new ChipDef(`
CHIP Nand {
  IN a,b;
  OUT out;
}`).addBuiltin('js', `// builtin
function Nand () {
  return function Nand (a, b) {
    return [Number(!(a && b))];
  }
}`);
