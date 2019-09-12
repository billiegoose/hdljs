import { CommandType } from './types.mjs'

export default class Parser {
  constructor (input) {
    Object.defineProperty(this, 'lines', {enumerable: false, writable: true})
    this.lines = input.replace(/\r/g, '').trim().split(/\n/)
    this.address = 0
  }
  hasMoreCommands() {
    return this.lines.length > 0
  }
  advance() {
    this.arg1 = ''
    this.arg2 = ''
    this.commandType = CommandType.NotDeterminedYet

    let line = this.lines.shift()
    // remove comments
    line = line.replace(/\/\/.*$/, '').trim()
    if (line === '') {
      this.advance()
    } else {
      const [command, arg1, arg2] = line.split(/\s+/)
      this.command = command
      switch (command) {
        case 'add':
        case 'sub':
        case 'neg':
        case 'eq':
        case 'gt':
        case 'lt':
        case 'and':
        case 'or':
        case 'not':
          this.commandType = CommandType.Arithmetic
          break
        case 'push':
          this.commandType = CommandType.Push
          break
        case 'pop':
          this.commandType = CommandType.Pop
          break
      }
      this.arg1 = arg1
      this.arg2 = arg2
    }
  }
}
