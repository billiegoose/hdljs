import { NandSim } from './NandSim.js'
import { SuperLightweightObservable } from './SuperLightweightObservable.js'

export const sim = new NandSim()
const partlist = {}

const allPinsHaveValues = (chip) => {
  for (const prop of Object.getOwnPropertyNames(chip)) {
    if (chip[prop] instanceof Pin) {
      if (chip[prop].value === null) return false
    }
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

export class Bus extends SuperLightweightObservable {
  constructor(...pins) {
    super()
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
    Object.defineProperty(chip, name, {
      get: () => this,
      set: this.wire.bind(this),
      enumerable: true,
      configurable: true
    })
    this.name(`${chip.id}.${name}`)
  }
  name (name) {
    for (let i = 0; i < this.length; i++) {
      this[i].subscribe({
        next: (value) => {
          sim.namePin(value, `${name}[${i}]`)
          if (allPinsHaveValues(this)) {
            sim.nameBus(name, this._pins.map(pin => pin.value))
          }
        }
      })
    }
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
  }
  get id () {
    return `${this.constructor.name}_${this._id}`
  }
}
