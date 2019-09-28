import * as T from './types.mjs'

function matchRegex (origtext, regex) {
  let matches = origtext.match(regex)
  if (matches !== null) {
    let text = origtext.slice(matches[0].length)
    return [matches[0], text]
  } else {
    return [null, origtext]
  }
}

function matchWhitespace (text) {
  let token = new T.WHITESPACE()
  let _token, _text = text

  // Consume (or backtrack)
  ;[_token, _text] = matchRegex(_text, /^(\s*(--[^\n]*\n)?)*/)
  if (_token === null) { return [null, text] } else { token.push(_token) }

  return [token, _text]
}

const matchJustIdentifier = (text) => {
  let _token, _text = text

  ;[_token, _text] = matchRegex(_text, /^[a-zA-Z_]\w*/)
  if (_token === null) { return [null, text] } else { return [_token, _text] }
}

function matchJustNumber (origtext) {
  let matches = origtext.match(/^[0-9]+/)
  if (matches !== null) {
    let text = origtext.slice(matches[0].length)
    return [['NUMBER', matches[0]], text]
  } else {
    return [null, origtext]
  }
}

const matchJustString = (origtext) => {
  if (origtext.startsWith("'")) {
    // search for ending quote
    let i = 1
    i = origtext.indexOf("'", i)
    while (i + 1 < origtext.length && origtext[i+1] === "'") {
      // keep searching
      i = origtext.indexOf("'", i + 2)
      if  (i === -1) {
        return [null, origtext]
      }
    }
    return [origtext.slice(1, i).replace(/''/g, "'"), origtext.slice(i+1)]
  }
  return [null, origtext]
}

function matchString (text) {
  let token = new T.STRING()
  let _token, _text = text

  // Consume (or backtrack)
  ;[_token, _text] = matchWhitespace(_text)
  if (_token === null) { return [null, text] } else { token.push(_token) }

  // Discard
  token.pop()

  // Consume (or backtrack)
  ;[_token, _text] = matchJustString(_text)
  if (_token === null) { return [null, text] } else { token.push(_token) }

  return [token, _text]
}

function matchIdentifier (text) {
  let token = new T.ID()
  let _token, _text = text

  // Consume (or backtrack)
  ;[_token, _text] = matchWhitespace(_text)
  if (_token === null) { return [null, text] } else { token.push(_token) }

  // Discard
  token.pop()

  // Consume (or backtrack)
  ;[_token, _text] = matchJustIdentifier(_text)
  if (_token === null) { return [null, text] } else { token.push(_token) }

  return [token, _text]
}

function matchLiteral (text, literal) {
  let _token, _text = text
  ;[_token, _text] = matchWhitespace(_text)

  if (_text.startsWith(literal)) {
    return [new T.LITERAL(literal), _text.slice(literal.length)]
  } else {
    return [null, text]
  }
}

const mMatchLiteral = (literal) => (origtext) => {
  let [_, text] = matchWhitespace(origtext)

  if (text.startsWith(literal)) {
    return [new T.LITERAL(literal), text.slice(literal.length)]
  }
  return [null, origtext]
}

const wrap = (type, cond = () => true) => (matcher) => (origtext) => {
  let [match, text] = matcher(origtext)
  if (match === null) return [match, origtext]
  if (!cond(match)) return [match, origtext]
  if (match.constructor.name === 'Array') {
    return [new T[type](...match), text]
  } else {
    return [new T[type](match), text]
  }
}

function matchGroup (text) {
  let token = new T.GROUP()
  let _token, _text = text

  // Consume (or backtrack)
  ;[_token, _text] = matchLiteral(_text, '(')
  if (_token === null) { return [null, text] } else { token.push(_token) }

  // Discard
  token.pop()

  // Consume (or throw)
  ;[_token, _text] = matchEx1(_text)
  if (_token === null) { throw new Error(text) } else { token.push(_token) }

  // Consume (or throw)
  ;[_token, _text] = matchLiteral(_text, ')')
  if (_token === null) { throw new Error(text) } else { token.push(_token) }

  // Discard
  token.pop()

  return [token, _text]
}

function matchRepetition (text) {
  let token = new T.REPEAT()
  let _token, _text = text

  // Consume (or backtrack)
  ;[_token, _text] = matchLiteral(_text, '$')
  if (_token === null) { return [null, text] } else { token.push(_token) }

  // Discard
  token.pop()

  // Consume (or throw)
  ;[_token, _text] = matchEx3(_text)
  if (_token === null) { throw new Error(text) } else { token.push(_token) }

  return [token, _text]
}

function matchType (text) {
  let token = new T.TYPE()
  let _token, _text = text

  // Consume (or backtrack)
  ;[_token, _text] = matchLiteral(_text, '{')
  if (_token === null) { return [null, text] } else { token.push(_token) }

  // Discard
  token.pop()

  // Consume (or throw)
  ;[_token, _text] = matchEx1(_text)
  if (_token === null) { throw new Error(text) } else { token.push(_token) }

  // Consume (or backtrack)
  ;[_token, _text] = matchLiteral(_text, ':')
  if (_token === null) { throw new Error(text) } else { token.push(_token) }

  // Discard
  token.pop()

  // Consume (or throw)
  ;[_token, _text] = matchIdentifier(_text)
  if (_token === null) { throw new Error(text) } else { token.push(_token) }

  // Consume (or backtrack)
  ;[_token, _text] = matchLiteral(_text, '}')
  if (_token === null) { throw new Error(text) } else { token.push(_token) }

  // Discard
  token.pop()

  return [token, _text]
}

function matchEx3 (text) {
  let token = new Array()
  let _token, _text = text

  {
    let __text = _text
    for (let i = 0; i <= 9; i++) {
      let breakFor = false
      switch (i) {
        case 0: {
          // Consume (or try next)
          ;[_token, __text] = matchIdentifier(_text)
          if (_token === null) { continue } else { token.push(_token); breakFor = true; break }
        }
        case 1: {
          // Consume (or try next)
          ;[_token, __text] = matchString(_text)
          if (_token === null) { continue } else { token.push(_token); breakFor = true; break }
        }
        case 2: {
          // Consume (or try next)
          ;[_token, __text] = matchLiteral(_text, '.ID')
          if (_token === null) { continue } else { token.push(_token); breakFor = true; break }
        }
        case 3: {
          // Consume (or try next)
          ;[_token, __text] = matchLiteral(_text, '.NUMBER')
          if (_token === null) { continue } else { token.push(_token); breakFor = true; break }
        }
        case 4: {
          // Consume (or try next)
          ;[_token, __text] = matchLiteral(_text, '.STRING')
          if (_token === null) { continue } else { token.push(_token); breakFor = true; break }
        }
        case 5: {
          // Consume (or try next)
          ;[_token, __text] = matchGroup(_text)
          if (_token === null) { continue } else { token.push(_token); breakFor = true; break }
        }
        case 6: {
          // Consume (or try next)
          ;[_token, __text] = matchType(_text)
          if (_token === null) { continue } else { token.push(_token); breakFor = true; break }
        }
        case 7: {
          // Consume (or try next)
          ;[_token, __text] = matchLiteral(_text, '.EMPTY')
          if (_token === null) { continue } else { token.push(_token); breakFor = true; break }
        }
        case 8: {
          // Consume (or try next)
          ;[_token, __text] = matchRepetition(_text)
          if (_token === null) { continue } else { token.push(_token); breakFor = true; break }
        }
        case 9: {
          // Backtrack
          return [null, text]
        }
      }
      if (breakFor) break
    }
    _text = __text
  }

  return [...token, _text]
}

const matchWhile = (matcher) => (origtext) => {
  let list = []
  let text = origtext
  let value
  while(text.length > 0) {
    ;[value, text] = matcher(text)
    if (value !== null) {
      list.push(value)
    } else {
      break
    }
  }
  return [['WHILE', list], text]
}

const _matchWhile = (matcher) => (origtext) => {
  let list = []
  let text = origtext
  let value
  while(text.length > 0) {
    ;[value, text] = matcher(text)
    if (value !== null) {
      list.push(value)
    } else {
      break
    }
  }
  return [list, text]
}

function matchEx2 (text) {
  let token = new T.SEQ()
  let _token, _text = text

  // Consume (or backtrack)
  ;[_token, _text] = matchEx3(_text)
  if (_token === null) { return [null, text] } else { token.push(_token) }

  // Consume 0 or more times
  while (true) {

    // Consume (or continue)
    ;[_token, _text] = matchEx3(_text)
    if (_token === null) { break } else { token.push(_token) }

  }

  // Collapse single-length sequences. TODO: IS THIS A BAD IDEA?
  if (token.length === 1) {
    return [token[0], _text]
  }

  return [token, _text]
}

function matchEx1 (text) {
  let token = new T.ALT()
  let _token, _text = text

  // Consume (or backtrack)
  ;[_token, _text] = matchEx2(_text)
  if (_token === null) { return [null, text] } else { token.push(_token) }

  // Consume 0 or more times
  while (true) {

    // Consume (or continue)
    ;[_token, _text] = matchLiteral(_text, '/')
    if (_token === null) { break } else { token.push(_token) }

    // Discard
    token.pop()

    // Consume (or error)
    ;[_token, _text] = matchEx2(_text)
    if (_token === null) { throw new Error(_text) } else { token.push(_token) }

  }

  // Collapse single-length sequences. TODO: IS THIS A BAD IDEA?
  if (token.length === 1) {
    return [token[0], _text]
  }

  return [token, _text]
}

function matchRule (text) {
  let token = new T.RULE()
  let _token, _text = text

  // Consume (or backtrack)
  ;[_token, _text] = matchIdentifier(_text)
  if (_token === null) { return [null, text] } else { token.push(_token) }

  // Consume (or throw)
  ;[_token, _text] = matchLiteral(_text, '=')
  if (_token === null) { throw new Error(text) } else { token.push(_token) }

  // Discard
  token.pop()

  // Consume (or throw)
  ;[_token, _text] = matchEx1(_text)
  if (_token === null) { throw new Error(text) } else { token.push(_token) }

  // Consume (or throw)
  ;[_token, _text] = matchLiteral(_text, ';')
  if (_token === null) { throw new Error(text) } else { token.push(_token) }

  // Discard
  token.pop()

  return [token, _text]
}

function matchRules (text) {
  let token = new T.RULES()
  let _token, _text = text

  // Consume 0 or more times
  while (true) {

    // Consume (or continue)
    ;[_token, _text] = matchRule(_text)
    if (_token === null) { break } else { token.push(_token) }

  }

  return [token, _text]
}

function matchSyntax (text) {
  let token = new T.SYNTAX()
  let _token, _text = text

  // Consume (or backtrack)
  ;[_token, _text] = matchLiteral(_text, '.SYNTAX')
  if (_token === null) { return [null, text] } else { token.push(_token) }

  // Discard
  token.pop()

  // Consume (or throw)
  ;[_token, _text] = matchIdentifier(_text)
  if (_token === null) { throw new Error(text) } else { token.push(_token) }

  // Consume (or throw)
  ;[_token, _text] = matchRules(_text)
  if (_token === null) { throw new Error(text) } else { token.push(_token) }

  // Consume (or backtrack)
  ;[_token, _text] = matchLiteral(_text, '.END')
  if (_token === null) { return [null, text] } else { token.push(_token) }

  // Discard
  token.pop()

  return [token, _text]
}

export { matchSyntax }


function smartJoin (strs, joiner, indent, postjoiner = '') {
  if (strs.join(joiner).length > 80) {
    return strs.join(postjoiner + '\n' + ' '.repeat(indent) + joiner.trimStart())
  }
}

function commaJoin (strs, indent) {
  let plain = strs.join(',')
  const I =  ' '.repeat(indent)
  if (plain.length < 40) return plain
  return '\n' + I + strs.join(`,\n${I}`) + '\n' + ' '.repeat(indent - 2)
}

export function print(ast, indent = 0) {
  if (ast instanceof T.STRING) {
    return `'${ast[0]}'`
  }
  if (ast instanceof T.LITERAL) {
    return ast[0]
  }
  if (ast instanceof T.ID) {
    return ast[0]
  }
  if (ast instanceof T.GROUP) {
    return `( ${print(ast[0])} )`
  }
  if (ast instanceof T.TYPE) {
    return `{ ${print(ast[0])} : ${print(ast[1])} }`
  }
  if (ast instanceof T.WHILE) {
    return ast.map(print).join(' ')
  }
  if (ast instanceof T.REPEAT) {
    return `$ ${print(ast[0])}`
  }
  if (ast instanceof T.SEQ) {
    return ast.map(print).join(' ')
  }
  if (ast instanceof T.ALT) {
    return smartJoin(ast.map(print), ' / ', indent)
  }
  if (ast instanceof T.RULE) {
    return `${print(ast[0])} = ${print(ast[1], ast[0][0].length + 1)} ;`
  }
  if (ast instanceof T.RULES) {
    return ast.map(print).join('\n')
  }
  if (ast instanceof T.SYNTAX) {
    return `.SYNTAX ${print(ast[0])}\n${print(ast[1])}`
  }
  console.log(`Forgot about '${ast.constructor}' did ye?`)
}

export function compileParser(ast, indent = 0) {
  const I = ' '.repeat(indent)
  if (ast instanceof T.STRING) {
    return `mMatchLiteral('${ast[0]}')`
  }
  if (ast instanceof T.NUMBER) {
    return `matchNumber`
  }
  if (ast instanceof T.LITERAL) {
    switch (ast[0]) {
      case '.ID': return 'matchIdentifier'
      case '.STRING': return 'matchString'
      case '.NUMBER': return 'matchNumber'
      default: return `throw new Error('Invalid ${ast[0]}')`
    }
  }
  if (ast instanceof T.ID) {
    return `match${ast[0]}`
  }
  if (ast instanceof T.GROUP) {
    return `matchGroup`
  }
  if (ast instanceof T.TYPE) {
    return `wrap('${ast[1][0]}')(${compileParser(ast[0])})`
  }
  if (ast instanceof T.REPEAT) {
    return `matchWhile(${compileParser(ast[0])})`
  }
  if (ast instanceof T.SEQ) {
    return `matchSequence([${commaJoin(ast.map(compileParser), 6)}])`
  }
  if (ast instanceof T.ALT) {
    return `matchAlt([${commaJoin(ast.map(compileParser), 4)}])`
  }
  if (ast instanceof T.RULE) {
    return `${I}function match${ast[0][0]} (text) {\n${I}  return ${compileParser(ast[1])}(text)\n${I}};`
  }
  if (ast instanceof T.RULES) {
    return ast.map(v => compileParser(v, indent)).join('\n')
  }
  if (ast instanceof T.SYNTAX) {
    return `${I}function parse${ast[0][0]} (text) {\n${compileParser(ast[1], indent + 2)}\n  return match${ast[0][0]}(text);\n}`
  }
  console.log(`Forgot about '${ast.constructor}' did ye?`)
}
