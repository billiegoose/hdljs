import { ChipDef } from '../components/ChipDef.mjs';

export const Copy = new ChipDef(`
CHIP Copy {
  IN in;
  OUT out;
}`).addBuiltin('js', `// builtin
function Copy () {
  return function Copy (input) {
    return [Number(input)];
  }
}`);
