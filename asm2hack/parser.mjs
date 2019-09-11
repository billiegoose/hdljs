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
    this.dest = ''
    this.comp = ''
    this.jump = ''
    this.symbol = ''
    this.commandType = 9 // 9 just means "not determined yet" here

    let line = this.lines.shift()
    let len = line.length

    let comment = false
    let stateJump = false
    let stateSymbol = false
    let cursor = 0

    while (cursor < len) {
      let nextchar = line[cursor]
      // technically comments start with two "//" but we'll treat a single slash as the start of a comment
      if (nextchar === '/') {
        comment = true
      }
      // skip whitespace and comments
      if (nextchar !== ' ' && !comment) {
        if (this.commandType === 9) {
          if (nextchar === '@') {
            this.commandType = 0
            this.address++
          } else if (nextchar === '(') {
            this.commandType = 2
          } else {
            this.commandType = 1
            this.address++
          }
        }
        if (nextchar === ')') {
          stateSymbol = false
        }
        if (stateSymbol) {
          this.symbol += nextchar
        } else if (stateJump) {
          this.jump += nextchar
        } else {
          if (nextchar === '=') {
            this.dest = this.comp
            this.comp = ''
          } else {
            if (nextchar !== ';' && nextchar !== '(' && nextchar !== ')') {
              this.comp += nextchar
            }
          }
        }
        if (nextchar === ';') {
          stateJump = true
        }
        if (nextchar === '@' || nextchar === '(') {
          stateSymbol = true
        }
      }
      cursor++
    }
    if (cursor === 0 && this.hasMoreCommands())  {
      this.advance()
    }
  }
}