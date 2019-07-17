import { Gate } from '../Gate.js'
import { Or } from './index.js'
import { repeat } from '../utils.js'

export class Or16 extends Gate {
  constructor() {
    super()
    repeat.call(this, Or, 16)
  }
}
