import path from 'path'
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
    // this.writeInit()
    this.callsites = {}
  }
  writeInit() {
    this.output += '// initializes the stack pointer\n'
    this.output += '@256\n'
    this.output += 'D=A\n'
    this.output += '@SP\n'
    this.output += 'M=D\n\n'
  }
  setFileName(filename) {
    this.filename = path.basename(filename, '.vm')
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
            this.output += `@${this.filename}.${index}\n`
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
            this.output += `@${this.filename}.${index}\n`
            this.output += 'M=D\n'
            break
          }
        }
      }
    }
  }
  writeLabel(label){
    this.output += `// label ${label}\n`
    this.output += `(${this.filename}.${this.functionName}$${label})\n`
  }
  writeGoto(label){
    this.output += `// goto ${label}\n`
    this.output += `@${this.filename}.${this.functionName}$${label}\n`
    this.output += `0;JMP\n`
  }
  writeIf(label){
    this.output += `// if-goto ${label}\n`
    this.output += popStack
    this.output += `@${this.filename}.${this.functionName}$${label}\n`
    this.output += `D;JNE\n`
  }
  writeCall(functionName, numArgs){
    this.output += `// call ${functionName} ${numArgs}\n`
    // generate a unique call site (return address) label
    let label = `${this.filename}.${this.functionName}-$-${functionName}`
    let i = (this.callsites[label] || 0) + 1
    this.callsites[label] = i
    let returnAddress = `${label}$${i}`
    // push return address
    this.output += `@${returnAddress}\n`
    this.output += `D=A\n`
    this.output += pushStack
    // push LCL, ARG, THIS, THAT
    this.output += `@LCL\n`
    this.output += `D=M\n`
    this.output += pushStack
    this.output += `@ARG\n`
    this.output += `D=M\n`
    this.output += pushStack
    this.output += `@THIS\n`
    this.output += `D=M\n`
    this.output += pushStack
    this.output += `@THAT\n`
    this.output += `D=M\n`
    this.output += pushStack
    // set LCL = SP
    this.output += `@SP\n`
    this.output += `D=A\n`
    this.output += `@LCL\n`
    this.output += `M=D\n`
    // set ARG = SP - n
    // note: D still contains @SP
    this.output += `@${parseInt(numArgs) - 5}\n`
    this.output += `D=D-A\n`
    this.output += `@ARG\n`
    this.output += `M=D\n`
    // jump to function
    this.output += `@${this.filename}.${this.functionName}\n`
    this.output += `0;JMP\n`
    // declare return address
    this.output += `(${returnAddress})`
  }
  writeReturn(){
    this.output += `// return\n`
    // ARG is going to become the new SP so keep a copy of it.
    // We're running out of VM-reserved registers so here we'll dip into the
    // `temp` segment by saving it to R12
    this.output += `@ARG\n`
    this.output += `D=M\n`
    this.output += `@R12\n`
    this.output += `M=D\n`
    // pop return value to R15
    this.output += popStack
    this.output += `@R15\n`
    this.output += `M=D\n`
    // reset SP to where it was right before the jump
    this.output += `@LCL\n`
    this.output += `D=A\n`
    this.output += `@SP\n`
    // pop THAT, THIS, ARG, LCL
    this.output += popStack
    this.output += `@THAT\n`
    this.output += `M=D\n`
    this.output += popStack
    this.output += `@THIS\n`
    this.output += `M=D\n`
    this.output += popStack
    this.output += `@ARG\n`
    this.output += `M=D\n`
    this.output += popStack
    this.output += `@LCL\n`
    this.output += `M=D\n`
    // pop return address to R14
    this.output += popStack
    this.output += `@R14\n`
    this.output += `M=D\n`
    // reset SP to ARG
    this.output += `@R12\n`
    this.output += `D=M\n`
    this.output += `@SP\n`
    this.output += `M=D\n`
    // push return value back to stack
    this.output += `@R15\n`
    this.output += `D=M\n`
    this.output += pushStack
    // jump to return address
    this.output += `@R14\n`
    this.output += `A=M\n`
    this.output += `0;JMP\n`
  }
  writeFunction(functionName, numLocals){
    this.output += `// function ${functionName} ${numLocals}\n`
    this.functionName = functionName
    this.output += `(${this.filename}.${this.functionName})\n`
    for (let i = 0; i < numLocals; i++) {
      this.output += 'D=0\n'
      this.output += writePointer('LCL', i)
    }
  }
}
