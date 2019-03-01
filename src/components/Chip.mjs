import { pinNames } from '../compilers/utils/pinNames.mjs'

export class Chip {
  constructor (chipDef) {
    this.name = chipDef.name;
    this.in = new Map()
    this.out = new Map()
    for (let [key, pin] of chipDef.in) {
      this.in.set(key, pin.clone())
    }
    for (let [key, pin] of chipDef.out) {
      this.out.set(key, pin.clone())
    }
    this.pins = new Map([...this.in, ...this.out]);
  }
  get width () {
    let sum = 0;
    for (let pin of this.pins.values()) {
      sum += pin.width;
    }
    return sum
  }
  inputNames (opts) {
    return pinNames(this.in, opts);
  }
  outputNames (opts) {
    return pinNames(this.out, opts);
  }
}
