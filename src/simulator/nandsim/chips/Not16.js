import { Gate } from '../Gate.js'
import { Not } from './index.js'
import { repeat } from '../utils.js'

export class Not16 extends Gate {
  constructor() {
    super()
    repeat.call(this, Not, 16)
  }
}
