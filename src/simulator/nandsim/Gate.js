import { NandSim } from './NandSim.js'
import { SuperLightweightObservable } from './SuperLightweightObservable.js'

export const sim = new NandSim()
const partlist = {}

const allPinsHaveValues = (chip) => {
  for (const prop of Object.keys(chip)) {
    if (chip[prop] instanceof Pin) {
      if (typeof chip[prop].value === 'undefined') return false
    }
  }
  return true
}

const place = (chip) => {
  if (chip.finalizer && allPinsHaveValues(chip)) chip.finalizer()
}

class Pin extends SuperLightweightObservable {
  constructor(chip, name) {
    super()
    if (chip) {
      this.subscribe({ next: () => place(chip) })
      if (name) {
        Object.defineProperty(chip, name, {
          get: () => this,
          set: (observer) => this.subscribe(observer)
        })
      }
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
}

export class InputPin extends Pin {
  constructor(chip, name) {
    super(chip, name)
  }
  input () {
    this.value = sim.addPin()
    sim.defineInput(this.value)
    return this
  }
}

export class OutputPin extends Pin {
  constructor(chip, name) {
    super(chip, name)
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

export class Gate {
  constructor() {
    const name = this.constructor.name
    if (!partlist[name]) partlist[name] = []
    this._id = partlist[name].length
    partlist[name].push(this)
  }
  get id () {
    return `${this.constructor.name}_${this._id}`
  }
}
