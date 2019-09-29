const PRELUDE = `
// * * * * * * * * * * * * * * * * BEGIN PRELUDE * * * * * * * * * * * * * * * * //

function node (name) {
  let c = (class extends Array {})
  Object.defineProperty(c, 'name', { value: name })
  return new c()
}

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
  let token = node('WHITESPACE')
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

function _matchSTRING (text) {
  let token = node('STRING')
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

function _matchID (text) {
  let token = node('ID')
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

function _matchLITERAL (text, literal) {
  let token = node('LITERAL')
  let _token, _text = text
  ;[_token, _text] = matchWhitespace(_text)

  if (_text.startsWith(literal)) {
    token.push(literal)
    return [token, _text.slice(literal.length)]
  } else {
    return [null, text]
  }
}

// * * * * * * * * * * * * * * * * END PRELUDE * * * * * * * * * * * * * * * * //
`

export { compileMatch }

function compileMatch (ast) {
  let text = ''
  let indent = 0

  function out (line) {
    text += ' '.repeat(indent * 2) + line + '\n'
  }

  // text += PRELUDE

  const fns = {
    SYNTAX: {
      enter (node) {
        out(`export { match${node[0][0]} }\n`)
      },
    },
    RULE: {
      enter (node) {
        let id = node[0][0]
        out(`function match${id} (text) {`)
        indent++
        out(`let _token, _text = text\n`)
      },
      exit (node) {
        out(`return [token, _text]`)
        indent--
        out(`}\n`)
      },
    },
    TYPE: {
      enter (node) {
        let id = node[1][0]
        out(`let token = node('${id}')`)
      }
    },
    ALT: {
      enter (node) {
        if (node.length > 1) {
          out(`{`)
          indent++
          out(`let __text = _text`)
          out(`for (let i = 0; i <= ${node.length}; i++) {`)
          indent++
          out(`let breakFor = false`)
          out(`switch (i) {`)
          indent++
        }
      },
      childEnter (i, child, node) {
        if (node.length > 1) {
          out(`case ${i}: {`)
          indent++
        }
      },
      childExit (i, child, node) {
        if (node.length > 1) {
          out(`breakFor = true`)
          indent--
          out(`}`)
        }
      },
      exit (node) {
        if (node.length > 1) {
          out(`case 9: {`)
          indent++
          out(`// Backtrack`)
          out(`return [null, text]`)
          indent--
          out(`}`)
          indent--
          out(`}`)
          indent--
          out(`_text = __text`)
          indent--
          out(`}`)
        }
      },
    },
    ID: {
      enter (node, stack) {
        let parent = stack && stack[stack.length - 1]
        if (parent) {
          if (parent.constructor.name === 'SEQ'
          || parent.constructor.name === 'REPEAT') {
            out(`;[_token, _text] = match${node[0]}(_text)`)
          }
        }
      }
    },
    SEQ: {
      childEnter (i, child, node) {
        let type = child.constructor.name
        if (type !== 'TYPE' && type !== 'REPEAT') {
          if (i === 0) {
            out(`// Consume (or backtrack)`)
          } else {
            out(`// Consume (or throw)`)
          }
        }
      },
      childExit (i, child, node) {
        let type = child.constructor.name
        if (type !== 'TYPE' && type !== 'REPEAT') {
          if (i === 0) {
            out(`if (_token === null) { return [null, text] } else { token.push(_token) }\n`)
          } else {
            out(`if (_token === null) { throw new Error(text) } else { token.push(_token) }\n`)
          }
        }
        // discard literals for now
        if (type === 'STRING') {
          out(`// Discard`)
          out(`token.pop()\n`)
        }
      }
    },
    STRING: {
      enter (node) {
        out(`;[_token, _text] = _matchLITERAL(_text, '${node[0]}')`)
      }
    },
    LITERAL: {
      enter (node) {
        if (node[0] === '.ID') {
          out(`;[_token, _text] = _matchID(_text)`)
        }
      }
    },
    REPEAT: {
      enter (node) {
        out(`// Consume 0 or more times`)
        out(`while (true) {\n`)
        indent++
      },
      childEnter (i, child, node) {
        out(`// Consume (or continue)`)
      },
      childExit (i, child, node) {
        out(`if (_token === null) { break } else { token.push(_token) }\n`)
      },
      exit (node) {
        indent--
        out(`}\n`)
      },
    }
  }

  function walk (node, stack) {
    const type = node.constructor.name
    // TODO: Narrow enter & exit by matching against stack
    let fn = fns[type]
    let enter = fn && fn.enter
    let exit = fn && fn.exit
    let childEnter = fn && fn.childEnter
    let childExit = fn && fn.childExit
    if (enter) enter(node, stack)
    if (Array.isArray(node)) {
      stack.push(node)
      for (let n = 0; n < node.length; n++) {
        let child = node[n]
        if (childEnter) childEnter(n, child, node)
        walk(child, stack)
        if (childExit) childExit(n, child, node)
      }
      stack.pop()
    }
    if (exit) exit(node, stack)
  }

  walk(ast, [])

  return text
}
