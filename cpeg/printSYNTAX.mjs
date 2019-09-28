// * * * * * * * * * * * * * * * * BEGIN PRELUDE * * * * * * * * * * * * * * * * //

function indentText (text) {
  return text.split('\n').map(line => '  ' + line.trimEnd()).join('\n')
}

function normalizeMultiline (chunks) {
  return chunks.map(chunk => chunk.includes('\n') ? chunk : '\n' + chunk + '\n')
    .map(chunk => chunk.replace(/\n\n/g, '\n'))
}

function space (text) {
  return (text.includes('\n') ? '\n' + text.replace(/\n */, '') : ' ' + text)
}

function smartJoin (strs, joiner) {
  if (strs.join(joiner).length > 80 || strs.some(str => str.includes('\n'))) {
    strs = strs.map((str, i, a) => 
      (str.includes('\n') ? str : '\n' + str )
       + (i === a.length - 1 ? '' : joiner.trimEnd())
    )
    return indentText(strs.join(''))
  } else {
    return strs.join(joiner)
  }
}

function _printSTRING(ast) {
  return `'${ast[0]}'`
}

function _printLITERAL(ast) {
  return String(ast[0])
}

function _printNUMBER(ast) {
  return Number(ast[0]).toFixed(0)
}

function _printID(ast) {
  return String(ast[0])
}

// * * * * * * * * * * * * * * * * END PRELUDE * * * * * * * * * * * * * * * * //

export { printSYNTAX }

function printSYNTAX (ast) {
  return `.SYNTAX ${_printID(ast[0])}\n${printRULES(ast[1])}`
}

function printRULES (ast) {
  return ast.map(printRULE).join('\n')
}

function printRULE (ast) {
  return `${_printID(ast[0])} =${space(printEXP(ast[1], ast[0][0].length + 1))} ;`
}

function printEXP (ast) {
  return printBLAW(ast[0])
}

function printALT (ast) {
  return smartJoin(ast.map(printBLAW), ' / ', )
}

function printSEQ (ast) {
  return ast.map(printBLAW).join(' ')
}

function printGROUP (ast) {
  return `( ${printBLAW(ast[0])} )`
}

function printREPEAT (ast) {
  return `$ ${printBLAW(ast[0])}`
}

function printTYPE (ast) {
  return smartJoin(['{', printBLAW(ast[0], 2), ':', _printID(ast[1]), '}'], ' ')
}


function printBLAW (ast) {
  switch (ast.constructor.name) {
    case 'STRING': 
      return _printSTRING(ast)
    case 'LITERAL':
      return _printLITERAL(ast)
    case 'ID':
      return _printID(ast)
    case 'GROUP':
      return printGROUP(ast)
    case 'TYPE':
      return printTYPE(ast)
    case 'REPEAT':
      return printREPEAT(ast)
    case 'SEQ':
      return printSEQ(ast)
    case 'ALT':
      return printALT(ast)      
    default:
      return console.log(`Forgot about '${ast.constructor}' did ye?`)
  }
}
