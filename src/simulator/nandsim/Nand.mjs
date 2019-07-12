import { NandSim } from './NandSim.mjs'
import { SuperLightweightObservable } from './SuperLightweightObservable.mjs'

export const sim = new NandSim()
const NandList = []

const place = (nand) => {
  if (typeof nand.a.value !== 'undefined' && typeof nand.b.value !== 'undefined' && typeof nand.out.value !== 'undefined') {
    sim.addNand(nand.a.value, nand.b.value, nand.out.value)
  }
}

class Pin extends SuperLightweightObservable {
  constructor(nand) {
    super()
    if (nand) this.subscribe({ next: () => place(nand) })
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

class InputPin extends Pin {
  constructor(nand) {
    super(nand)
  }
  input () {
    this.value = sim.addPin()
    sim.defineInput(this.value)
    return this
  }
}

class OutputPin extends Pin {
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

export class Nand {
  _id = NandList.length
  constructor() {
    NandList.push(this)
    this._a = new InputPin(this)
    this._b = new InputPin(this)
    this._out = new OutputPin()
  }
  get id () {
    return `${this.constructor.name}_${this._id}`
  }
  set out (observer) {
    this._out.subscribe(observer)
  }
  get out () {
    return this._out
  }
  get a () {
    return this._a
  }
  set a (observer) {
    this._a.subscribe(observer)
  }
  get b () {
    return this._b
  }
  set b (observer) {
    this._b.subscribe(observer)
  }
}
