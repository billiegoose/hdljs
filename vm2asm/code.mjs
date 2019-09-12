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
        this.output += popStack
        this.output += moveToReg('R13')
        this.output += popStack
        this.output += '@R13\n'
        this.output += 'D=D+M\n'
        this.output += pushStack
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
