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

const read = (register, base, index) => `@${base} // read ${register} ${base} ${index}
D=${register}
@${index}
A=A+D
D=M // end read
`

const readPointer = (base, index) => read('M', base, index)

const readDirect = (base, index) => read('A', base, index)

const write = (register, base, index) => `@R13 // write ${register} ${base} ${index}
M=D
@${base}
D=${register}
@${index}
D=A+D
@R14
M=D
@R13
D=M
@R14
A=M
M=D // end write
`

const writePointer = (base, index) => write('M', base, index)

const writeDirect = (base, index) => write('A', base, index)

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
  setFileName(filename) {
    this.filename = filename
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
          case 'local': {
            this.output += readPointer('LCL', index)
            this.output += pushStack
            break
          }
          case 'argument': {
            this.output += readPointer('ARG', index)
            this.output += pushStack
            break
          }
          case 'this': {
            this.output += readPointer('THIS', index)
            this.output += pushStack
            break
          }
          case 'that': {
            this.output += readPointer('THAT', index)
            this.output += pushStack
            break
          }
          case 'pointer': {
            this.output += readDirect(3, index)
            this.output += pushStack
            break
          }
          case 'temp': {
            this.output += readDirect(5, index)
            this.output += pushStack
            break
          }
          case 'static': {
            this.output += `@${filename}.${index}\n`
            this.output += 'D=M\n'
            this.output += pushStack
            break
          }
        }
        break
      }
      case 'pop': {
        switch (segment) {
          case 'constant': throw new Error(`Cannot pop to constant segment`)
          case 'local': {
            this.output += popStack
            this.output += writePointer('LCL', index)
            break
          }
          case 'argument': {
            this.output += popStack
            this.output += writePointer('ARG', index)
            break
          }
          case 'this': {
            this.output += popStack
            this.output += writePointer('THIS', index)
            break
          }
          case 'that': {
            this.output += popStack
            this.output += writePointer('THAT', index)
            break
          }
          case 'pointer': {
            this.output += popStack
            this.output += writeDirect(3, index)
            break
          }
          case 'temp': {
            this.output += popStack
            this.output += writeDirect(5, index)
            break
          }
          case 'static': {
            this.output += popStack
            this.output += `@${filename}.${index}\n`
            this.output += 'M=D\n'
            break
          }
        }
      }
    }
  }
}
