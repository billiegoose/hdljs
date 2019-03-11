import { observable, autorun, reaction } from "./mobx.module.mjs"

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

export class Wire {
  constructor (source, sink) {
    autorun(() => {
      sink.value = source.value
    });
  }
}

export class Chip {
  constructor (chipDef, depth = 0) {
    const Class = getClass(chipDef.name)
    if (Class !== Chip) return new Class(chipDef, inputs);
    if (chipDef.clocked) this.clock = clock;
    this.pins = observable.object({})
    this.parts = observable.object({})
    // Create the chip's pins.
    for (let name of [...chipDef.inputNames(), ...chipDef.internalNames(), ...chipDef.outputNames()]) {
      this.pins[name] = new Pin();
    }
    // Create the chip's parts and their pins.
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
          // console.log(`${'    '.repeat(depth)}${chipDef.name} ${ext} -> ${part.chip.name} ${name}`)
        } else {
          // Inputs that aren't listed in the assignment are set to 0.
          inputs[name] = new Pin(0);
        }
      }
      // create the part
      const Class = getClass(chipname)
      let instance = new Class(global.chipRegistry.get(chipname), depth + 1);
      this.parts[partname] = instance;
      // Connect chip pins to part inputs
      for (let ext of part.chip.inputNames()) {
        let int = part.chip.mapping[ext]
        let pin = null;
        if (int === '1') {
          // Hard-coded input of 1
          pin = new Pin(1);
        } else if (int === '0') {
          // Hard-coded input of 0
          pin = new Pin(0);
        } else if (int) {
          // Use one of this chip's pins as the input
          pin = this.pins[int]
          // console.log(`${'    '.repeat(depth)}${chipDef.name} ${int} -> ${part.chip.name} ${ext}`)
        } else {
          // Inputs that aren't listed in the assignment are set to 0.
          pin = new Pin(0);
        }
        new Wire(pin, instance.pins[ext])
      }
      // Connect part outputs to chip pins
      for (let ext of part.chip.outputNames()) {
        let int = part.chip.mapping[ext]
        new Wire(instance.pins[ext], this.pins[int])
        // console.log(`${'    '.repeat(depth)}${chipDef.name} ${int} <- ${part.chip.name} ${ext}`)
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
    const a_0 = new Pin(0);
    const b_0 = new Pin(0);
    const out_0 = observable.object({
      get value() {
        // console.log(`get it! ${self.pins.a_0.value} ${self.pins.b_0.value}`)
        if (a_0 === undefined) throw new Error('a_0 undefined!')
        // if (self.pins.b_0 === undefined) {
        //   console.log(self)
        //   console.log(self.pins.a_0.value)
        //   console.log(self.pins.b_0)
        //   throw new Error('b_0 undefined!')
        // }
        const a = a_0.value;
        const b = b_0.value;
        return Number(!(a && b));
      }
    });
    this.pins = { a_0, b_0, out_0 }
    this.parts = {}
  }
}

export class DFF {
  constructor () {
    this.clock = clock
    const in_0 = new Pin(0);
    const out_0 = new Pin(0);
    this._state = 1;
    const self = this;
    reaction(
      () => clock.value,
      (value) => value ? self.tick() : self.tock()
    )
    this.pins = { in_0, out_0 };
    this.parts = {}
  }
  tick () {
    // console.log(this.pins.in_0);
    this._state = this.pins.in_0.value;
  }
  tock () {
    this.pins.out_0.value = this._state;
  }
}

export function getClass(name) {
  switch (name) {
    case 'Nand': return Nand;
    case 'DFF': return DFF;
    default: return Chip;
  }
}
