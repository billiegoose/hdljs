import { Gate } from '../Gate.js'
import { And } from './index.js'
import { repeat } from '../utils.js'

export class And16 extends Gate {
  constructor() {
    super()
    repeat.call(this, And, 16)
  }
}
