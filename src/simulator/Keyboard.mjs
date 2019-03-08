import { ChipDef } from "../components/ChipDef.mjs"

export const Keyboard = new ChipDef(`
CHIP Keyboard {
  OUT out[16];
}`).addBuiltin('js', `
function Keyboard () {
  const log = document.getElementById('keyboard');

  let lastKeyCode = 0;
  let downKeys = new Set();

  const updateScreen = () => {
    requestAnimationFrame(updateScreen);
    log.textContent = lastKeyCode;
  }
  requestAnimationFrame(updateScreen);

  function toCode (key) {
    if (key.length === 1) {
      return key.charCodeAt(0);
    } else {
      switch (key) {
        case 'Enter': return 128;
        case 'Backspace': return 129;
        case 'ArrowLeft': return 130;
        case 'ArrowUp': return 131;
        case 'ArrowRight': return 132;
        case 'ArrowDown': return 133;
        case 'Home': return 134;
        case 'End': return 135;
        case 'PageUp': return 136;
        case 'PageDown': return 137;
        case 'Insert': return 138;
        case 'Delete': return 139;
        case 'Escape': return 140;
        case 'F1': return 141;
        case 'F2': return 142;
        case 'F3': return 143;
        case 'F4': return 144;
        case 'F5': return 145;
        case 'F6': return 146;
        case 'F7': return 147;
        case 'F8': return 148;
        case 'F9': return 149;
        case 'F10': return 150;
        case 'F11': return 151;
        case 'F12': return 152;
      }
    }
  }

  document.addEventListener('keydown', event => {
    let code = toCode(event.key);
    if (code === undefined) return;
    downKeys.add(code);
    lastKeyCode = code;
  });

  document.addEventListener('keyup', event => {
    let code = toCode(event.key);
    if (code === undefined) return;
    downKeys.delete(code);
    if (downKeys.size === 0) {
      lastKeyCode = 0;
    } else {
      lastKeyCode = [...downKeys][downKeys.size - 1];
    }
  })
  return function Keyboard () {
    return [
      Number(!!(lastKeyCode & 1)), // 1
      Number(!!(lastKeyCode & 2)),
      Number(!!(lastKeyCode & 4)),
      Number(!!(lastKeyCode & 8)), // 4
      Number(!!(lastKeyCode & 16)),
      Number(!!(lastKeyCode & 32)),
      Number(!!(lastKeyCode & 64)),
      Number(!!(lastKeyCode & 128)), // 8
      Number(!!(lastKeyCode & 256)),
      Number(!!(lastKeyCode & 512)),
      Number(!!(lastKeyCode & 1024)),
      Number(!!(lastKeyCode & 2048)), // 12
      Number(!!(lastKeyCode & 4096)),
      Number(!!(lastKeyCode & 8192)),
      Number(!!(lastKeyCode & 16384)),
      Number(!!(lastKeyCode & 32768)) // 16
    ];
  }
}`);