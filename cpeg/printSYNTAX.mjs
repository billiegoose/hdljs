// * * * * * * * * * * * * * * * * BEGIN PRELUDE * * * * * * * * * * * * * * * * //

function indentText (text) {
  return text.split('\n').map(line => '  ' + line.trimEnd()).join('\n')
}

function dedentText (text) {
  return text.split('\n').map(line => line.trimEnd().replace(/^  /, '')).join('\n')
}

function smartJoin (strs, joiner = ' ') {
  if (strs.join(joiner).length > 80 || strs.some(str => str.includes('\n'))) {
    strs = strs.map((str, i, a) => 
      (str.includes('\n') ? str : '\n' + str )
       + (i === a.length - 1 ? '' : joiner.trimEnd())
    )
    let text = strs.join('')
    if (strs.length > 1) text = indentText(text)
    return text
  } else {
    return strs.join(joiner)
  }
}

function hangingJoin (strs, joiner) {
  if (strs.join(joiner).length > 80 || strs.some(str => str.includes('\n'))) {
    return dedentText(smartJoin(strs, joiner)).trimLeft()
  } else {
    return strs.join(joiner)
  }
}

function newlineJoin (strs) {
  return strs.join('\n')
}

function nonbreakingJoin (strs) {
  return strs.join(' ')
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

function _printLiteral(literal) {
  return literal
}

// * * * * * * * * * * * * * * * * END PRELUDE * * * * * * * * * * * * * * * * //

export { printSYNTAX }

function printSYNTAX (ast) {
  switch (ast.constructor.name) {
    case 'SYNTAX': {
      let $0 = _printID(ast[0])
      let $1 = printRULES(ast[1])
      return newlineJoin([['.SYNTAX', $0].join(' '), $1, '.END'])
    }
    default:
      throw new TypeError(ast)
  }
}

function printRULES (ast) {
  switch (ast.constructor.name) {
    case 'RULES': {
      let $0 = ast.map(printRULE)
      return newlineJoin([...$0])
    }
    default:
      throw new TypeError(ast)
  }
}

function printRULE (ast) {
  switch (ast.constructor.name) {
    case 'RULE': {
      let $0 = _printID(ast[0])
      let $1 = printEXP(ast[1])
      return hangingJoin([nonbreakingJoin([$0, '=']), $1, ';'], ' ')
    }
    default:
      throw new TypeError(ast)
  }
}

function printEXP (ast) {
  switch (ast.constructor.name) {
    case 'EXP': {
      let $0 = printALT(ast[0])
      return smartJoin([$0], ' ')
    }
    default:
      throw new TypeError(ast)
  }
}

function printALT (ast) {
  switch (ast.constructor.name) {
    case 'ALT': {
      let $0 = ast.map(printSEQ)
      return smartJoin([...$0], ' / ')
    }
    default:
      throw new TypeError(ast)
  }
}

function printSEQ (ast) {
  switch (ast.constructor.name) {
    case 'SEQ': {
      let $0 = ast.map(printTERM)
      return smartJoin([...$0], ' ')
    }
    default:
      throw new TypeError(ast)
  }
}

function printGROUP (ast) {
  switch (ast.constructor.name) {
    case 'GROUP': {
      let $0 = printALT(ast[0])
      return smartJoin(['(', $0, ')'], ' ')
    }
    default:
      throw new TypeError(ast)
  }
}

function printTYPE (ast) {
  switch (ast.constructor.name) {
    case 'TYPE': {
      let $0 = printALT(ast[0])
      let $1 = _printID(ast[1])
      return smartJoin(['{', $0, ':', $1, '}'], ' ')
    }
    default:
      throw new TypeError(ast)
  }
}

function printREPEAT (ast) {
  switch (ast.constructor.name) {
    case 'REPEAT': {
      let $0 = printTERM(ast[0])
      return smartJoin(['$', $0], ' ')
    }
    default:
      throw new TypeError(ast)
  }
}

function printTERM (ast) {
  switch (ast.constructor.name) {
    case 'ID': {
      let $0 = _printID(ast)
      return smartJoin([$0], ' ')
    }
    case 'STRING':  {
      let $0 = _printSTRING(ast)
      return smartJoin([$0], ' ')
    }
    case 'LITERAL': {
      let $0 = _printLITERAL(ast)
      return smartJoin([$0], ' ')
    }
    case 'GROUP': {
      let $0 = printGROUP(ast)
      return smartJoin([$0], ' ')
    }
    case 'TYPE': {
      let $0 = printTYPE(ast)
      return smartJoin([$0], ' ')
    }
    case 'REPEAT': {
      let $0 = printREPEAT(ast)
      return smartJoin([$0], ' ')
    }
    default:
      throw new TypeError(ast)
  }
}
