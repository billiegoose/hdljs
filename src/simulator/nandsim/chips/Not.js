import { Nand } from '../Nand.js'

const NotList = []

export class Not {
  constructor() {
    this._id = NotList.length
    NotList.push(this)
    this._nand = new Nand()
    this._nand.a = this._nand.b
    this.in.name(`${this.id}.in`)
    this.out.name(`${this.id}.out`)
  }
  get id () {
    return `${this.constructor.name}_${this._id}`
  }
  get in () {
    return this._nand.a
  }
  set in (observer) {
    this._nand.a = observer
  }
  get out () {
    return this._nand.out
  }
  set out (observer) {
    this._nand.out = observer
  }
}
