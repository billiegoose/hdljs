import { Gate } from '../Gate.js'
import { Xor } from './index.js'
import { repeat } from '../utils.js'

export class Xor16 extends Gate {
  constructor() {
    super()
    repeat.call(this, Xor, 16)
  }
}
