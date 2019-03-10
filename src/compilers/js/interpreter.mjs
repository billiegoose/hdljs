import { observable } from "./mobx.module.mjs"

function wrapArg (name) {
  if (name === '0' || name === '1') return name;
  if (name === undefined) return '0';
  return `this.${name}`
}

export class Pin {
  constructor (value = 0) {
    return observable({ value })
  }
}

export class Chip {
  constructor (chipDef, inputs = {}) {
    this.pins = observable.object(inputs)
    this.parts = observable.object({})
    // Create the necessary input pins for a top-level chip.
    if (Object.keys(inputs).length === 0) {
      for (const name of chipDef.inputNames()) {
        this.pins[name] = new Pin();
      }
    }
    for (const part of chipDef.parts) {
      const chipname = part.chip.name;
      // Default to using just the chipname, Foo
      let partname = chipname;
      // If we already have a chip named Foo, rename it Foo_0
      // and set Foo to be a placeholder with the index we should use next
      if (this.parts[chipname] && typeof this.parts[chipname] !== 'number') {
        this.parts[`${chipname}_0`] = this.parts[chipname];
        this.parts[chipname] = 1;
      }
      // If we detect a placeholder at Foo, 
      if (this.parts[chipname] && typeof this.parts[chipname] === 'number') {
        // Use the name Foo_[placeholder]
        partname = `${chipname}_${this.parts[chipname]}`
      }
      // Map our current chip's pins to the parts inputs
      let inputs = {}
      for (const name of part.chip.inputNames()) {
        const ext = part.chip.mapping[name];
        if (ext === '1') {
          // Hard-coded input of 1
          inputs[name] = new Pin(1);
        } else if (ext === '0') {
          // Hard-coded input of 0
          inputs[name] = new Pin(0);
        } else if (ext) {
          // Use one of this chip's pins as the input
          inputs[name] = this.pins[ext]
        } else {
          // Inputs that aren't listed in the assignment are set to 0.
          inputs[name] = new Pin(0);
        }
      }
      // create the part
      const Class = getClass(chipname)
      let instance = new Class(global.chipRegistry.get(chipname), inputs);
      this.parts[partname] = instance;
      // hook up pins
      for (let [ext, int] of Object.entries(part.chip.mapping)) {
        if (part.chip.inputNames().includes(ext)) {
          // supply the part with the input pins
          // console.log(`${chipDef.name} ${int} -> ${part.chip.name} ${ext}`)
          instance.pins[ext] = this.pins[int];
        } else {
          // take the part's output pins
          // console.log(`${chipDef.name} ${int} <- ${part.chip.name} ${ext}`)
          this.pins[int] = instance.pins[ext];
        }
      }
    }
    // Remove placeholders
    for (const part of chipDef.parts) {
      const chipname = part.chip.name;
      // If we detect a placeholder at Foo, 
      if (this.parts[chipname] && typeof this.parts[chipname] === 'number') {
        delete this.parts[chipname]
      }
    }
  }
}

export const clock = new Pin()

export class Nand {
  constructor () {
    const a_0 = new Pin();
    const b_0 = new Pin();
    const self = this
    const out_0 = observable.object({
      get value() {
        // console.log(`get it! ${self.pins.a_0.value} ${self.pins.b_0.value}`)
        const a = self.pins.a_0.value;
        const b = self.pins.b_0.value;
        return Number(!(a && b));
      }
    });
    this.pins = observable.object({ a_0, b_0, out_0 })
    this.parts = {}
  }
}

export function getClass(name) {
  switch (name) {
    case 'Nand': return Nand;
    default: return Chip;
  }
}
