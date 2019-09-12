import { CommandType, ArithmeticCommand } from './types.mjs'

const moveToReg = (reg) => `@${reg}
M=D
`

const popStack = `@SP   // Decrement stack pointer
D=M-1 //
AM=D // also update A in prep for next command
D=M  // Pop value
`

const pushStack = `@SP // Push value to stack
A=M //
M=D //
@SP   // Increment stack pointer
D=M+1 //
M=D   //
`

const TRUE = `@1
D=-A`

const FALSE = `@0
D=A`

const binOp = (op) => `${popStack}${moveToReg('R13')}${popStack}@R13
D=D${op}M
${pushStack}`

const unOp = (op) => `${popStack}D=${op}D
${pushStack}`

let condCount = 0
const condOp = (cond) => `${popStack}${moveToReg('R13')}${popStack}@R13
D=D-M
@asmcond${condCount}
D;J${cond}
${FALSE}
@asmcondend${condCount}
0;JMP
(asmcond${condCount})
${TRUE}
(asmcondend${condCount++})
${pushStack}
`

export default class Code {
  constructor() {
    this.output = ''
    this.writePreamble()
  }
  writePreamble() {
    this.output += '// initializes the stack pointer\n'
    this.output += '@256\n'
    this.output += 'D=A\n'
    this.output += '@SP\n'
    this.output += 'M=D\n\n'
  }
  writeArithmetic (command) {
    this.output += `// ${command}\n`
    switch(command) {
      case 'add': {
        this.output += binOp('+')
        return
      }
      case 'sub': {
        this.output += binOp('-')
        return
      }
      case 'neg': {
        this.output += unOp('-')
        return
      }
      case 'eq': {
        this.output += condOp('EQ')
        return
      }
      case 'gt': {
        this.output += condOp('GT')
        return
      }
      case 'lt': {
        this.output += condOp('LT')
        return
      }
      case 'and': {
        this.output += binOp('&')
        return
      }
      case 'or': {
        this.output += binOp('|')
        return
      }
      case 'not': {
        this.output += unOp('!')
        return
      }
    }
    throw new Error(`Unrecognized command ${command}`)
  }
  writePushPop (command, segment, index) {
    this.output += `// ${command} ${segment} ${index}\n`
    switch (command) {
      case 'push': {
        switch (segment) {
          case 'constant': {
            this.output += `@${index}\n`
            this.output += 'D=A\n'
            this.output += pushStack
            break
          }
        }
        break
      }
    }
  }
}
