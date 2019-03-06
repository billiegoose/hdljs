import { ChipDef } from '../components/ChipDef.mjs';

export const DFF = new ChipDef(`
CHIP DFF {
  IN in;
  OUT out;
}`).addBuiltin('js', `// builtin
function DFF () {
  let _current = 0;
  return function DFF (input) {
    if (input === undefined) {
      return [_current];
    } else {
      let tmp = _current;
      _current = input;
      return [tmp];
    }
  }
}`);

DFF.clocked = true;
