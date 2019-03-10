export function attachKeyboard (chip) {
  chip.addBuiltin('js', `
class Keyboard {
  constructor () {
    const KBD = document.getElementById('keyboard');
    this.lastKeyCode = 0;
    let downKeys = new Set();

    const updateScreen = () => {
      requestAnimationFrame(updateScreen);
      KBD.textContent = this.lastKeyCode;
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
      this.lastKeyCode = code;
    });
  
    document.addEventListener('keyup', event => {
      let code = toCode(event.key);
      if (code === undefined) return;
      downKeys.delete(code);
      if (downKeys.size === 0) {
        this.lastKeyCode = 0;
      } else {
        this.lastKeyCode = [...downKeys][downKeys.size - 1];
      }
    })
  }
  tick () {
    this.out_0 = Number(!!(this.lastKeyCode & 1)); // 1
    this.out_1 = Number(!!(this.lastKeyCode & 2));
    this.out_2 = Number(!!(this.lastKeyCode & 4));
    this.out_3 = Number(!!(this.lastKeyCode & 8)); // 4
    this.out_4 = Number(!!(this.lastKeyCode & 16));
    this.out_5 = Number(!!(this.lastKeyCode & 32));
    this.out_6 = Number(!!(this.lastKeyCode & 64));
    this.out_7 = Number(!!(this.lastKeyCode & 128)); // 8
    this.out_8 = Number(!!(this.lastKeyCode & 256));
    this.out_9 = Number(!!(this.lastKeyCode & 512));
    this.out_10 = Number(!!(this.lastKeyCode & 1024));
    this.out_11 = Number(!!(this.lastKeyCode & 2048)); // 12
    this.out_12 = Number(!!(this.lastKeyCode & 4096));
    this.out_13 = Number(!!(this.lastKeyCode & 8192));
    this.out_14 = Number(!!(this.lastKeyCode & 16384));
    this.out_15 = Number(!!(this.lastKeyCode & 32768)); // 16
  }
}`);
}
