import { NandSim } from './NandSim.js'
import { SuperLightweightObservable } from './SuperLightweightObservable.js'

export const sim = new NandSim()
const partlist = {}

const allPinsHaveValues = (chip) => {
  for (const prop of chip._ports) {
    if (chip[prop].value === null) return false
  }
  return true
}

const place = (chip) => {
  if (chip.finalizer && allPinsHaveValues(chip)) {
    chip.finalizer()
  }
}

class Pin extends SuperLightweightObservable {
  constructor() {
    super()
  }
  attach (chip, name) {
    this.subscribe({ next: () => place(chip) })
    if (name) {
      Object.defineProperty(chip, name, {
        get: () => this,
        set: this.wire.bind(this),
        enumerable: true,
        configurable: true
      })
      this.name(`${chip.id}.${name}`)
    }
    chip._ports.push(name)
  }
  name (name) {
    this.subscribe({
      next (value) {
        sim.namePin(value, name)
      }
    })
    return this
  }
  wire (observer) {
    this.subscribe(observer)
  }
  // This is for symmetry with Bus.
  // We should probably unify Pin and Bus at some point.
  [Symbol.iterator] () {
    return [this][Symbol.iterator]();
  }
}

export class InputPin extends Pin {
  constructor() {
    super()
  }
  input () {
    this.value = sim.addPin()
    sim.defineInput(this.value)
    return this
  }
}

export class OutputPin extends Pin {
  constructor() {
    super()
    this.value = sim.addPin()
  }
  output () {
    this.subscribe({
      next (value) {
        sim.defineOutput(value)
      }
    })
    return
  }
}

export const hi = new InputPin()
hi.value = sim.HI
export const lo = new InputPin()
lo.value = sim.LO

export class Bus extends SuperLightweightObservable {
  constructor(...pins) {
    super()
    this._ports = []
    this._pins = pins
    for (let i = 0; i < pins.length; i++) {
      pins[i].attach(this, String(i))
    }
    Object.defineProperty(this, 'length', {
      value: pins.length,
      writable: false,
    })
  }
  attach (chip, name) {
    this.subscribe({ next: () => place(chip) })
    Object.defineProperty(chip, name, {
      get: () => this,
      set: (bus) => this.wire(...bus),
      enumerable: true,
      configurable: true
    })
    if (chip.id) {
      this.name(`${chip.id}.${name}`)
    }
    chip._ports.push(name)
  }
  get id () {
    return this._name
  }
  name (name) {
    this._name = name;
    place(this);
    return this
  }
  wire (...pins) {
    if (pins.length !== this.length) throw new Error(`Cannot assign ${pins.length} pin(s) to a bus of width ${this.length}`)
    for (let i = 0; i < pins.length; i++) {
      this[i].subscribe(pins[i])
    }
  }
  slice (start, end) {
    return new Bus(...this._pins.slice(start, end))
  }
  [Symbol.iterator] () {
    return this._pins[Symbol.iterator]();
  }
  input () {
    for (const pin of this) pin.input()
    return this
  }
  output () {
    for (const pin of this) pin.output()
    return this
  }
  finalizer () {
    this.value = this._pins.map(pin => pin.value)
    if (this._name) {
      for (let i = 0; i < this.length; i++) {
        sim.namePin(this._pins[i].value, `${this._name}[${i}]`)
      }
      sim.nameBus(this._name, this._pins.map(pin => pin.value))
    }
  }
}

export class Gate {
  constructor() {
    const name = this.constructor.name
    if (!partlist[name]) partlist[name] = []
    this._id = partlist[name].length
    partlist[name].push(this)
    Object.defineProperty(this, '_id', {
      enumerable: false,
    })
    this._ports = []
  }
  get id () {
    return `${this.constructor.name}_${this._id}`
  }
}
