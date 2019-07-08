import { NandSim } from './NandSim.mjs'
import { SuperLightweightObservable } from './SuperLightweightObservable.mjs'

export const sim = new NandSim()
const NandList = []

export class Nand {
  _id = NandList.length
  constructor() {
    NandList.push(this)
    this._a = new SuperLightweightObservable()
    this._b = new SuperLightweightObservable()
    this._out =  new SuperLightweightObservable()
    this._out.value = sim.addPin()
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
  place () {
    sim.addNand(this.a.value, this.b.value, this.out.value)
  }
}
