const PRELUDE = `// * * * * * * * * * * * * * * * * BEGIN PRELUDE * * * * * * * * * * * * * * * * //

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
  ;[_token, _text] = matchRegex(_text, /^(\\s*(--[^\\n]*\\n)?)*/)
  if (_token === null) { return [null, text] } else { _token && token.push(_token) }

  return [token, _text]
}

const matchJustIdentifier = (text) => {
  let _token, _text = text

  ;[_token, _text] = matchRegex(_text, /^[a-zA-Z_]\\w*/)
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
  if (_token !== null) _token = false // Discard literal
  if (_token === null) { return [null, text] } else { _token && token.push(_token) }

  // Consume (or backtrack)
  ;[_token, _text] = matchJustString(_text)
  if (_token === null) { return [null, text] } else { _token && token.push(_token) }

  return [token, _text]
}

function _matchID (text) {
  let token = node('ID')
  let _token, _text = text

  // Consume (or backtrack)
  ;[_token, _text] = matchWhitespace(_text)
  if (_token !== null) _token = false // Discard literal
  if (_token === null) { return [null, text] } else { _token && token.push(_token) }

  // Consume (or backtrack)
  ;[_token, _text] = matchJustIdentifier(_text)
  if (_token === null) { return [null, text] } else { _token && token.push(_token) }

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
  let text = PRELUDE
  let indent = 0

  function out (line) {
    text += ' '.repeat(indent * 2) + line + '\n'
  }

  function start (line = '') {
    text += ' '.repeat(indent * 2) + line
  }
  function mid (line = '') {
    text += line
  }
  function end (line = '') {
    text += line + '\n'
  }

  function call (ast) {
    fns(ast.constructor.name)(...ast)
  }

  const fns = {
    SYNTAX (id, rules) {
      start(`export { match`)
      call(id)
      end(` }`)
      end()
      call(rules)
    },
    ID (value) {
      mid(value)
    },
    RULES (...rules) {
      for (let rule of rules) {
        call(rule)
      }
    },
    RULE (id, exp) {
      start(`function match`)
      call(id)
      end(`} (text) {`)
      indent++
      out(`let _token, _text = text`)
      end()
      call(exp)
      out(`return [token, _text]`)
      indent--
      out(`}`)
      end()
    },
    EXP (alt) {
      call(alt)
    },
    ALT (...seqs) {
      if (seqs.length === 1) {
        call(seqs[0])
      } else {
        out(`{`)
        indent++
        out(`let __text = _text`)
        out(`for (let i = 0; i <= ${seqs.length}; i++) {`)
        indent++
        out(`let breakFor = false`)
        out(`switch (i) {`)
        indent++
        for (let seq of seqs) {
          out(`case ${i}: {`)
          indent++
          call(seq)
          out(`breakFor = true`)
          indent--
          out(`}`)
        }
        out(`case ${seqs.length}: {`)
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
    TYPE (alt, id) {
      start(`let token = node('`)
      call(id)
      end(`}')`)
      call(alt)
    },
    SEQ (...terms) {
      if (terms.length === 1) {
        call(terms[0])
      } else {
        let first = terms.shift()
        out(`// Consume (or backtrack)`)
        call(first)
        out(`if (_token === null) { return [null, text] } else { _token && token.push(_token) }`)
        end()

        for (let term of terms) {
          out(`// Consume (or throw)`)
          call(term)
          out(`if (_token === null) { throw new Error(text) } else { _token && token.push(_token) }`)
          end()
        }
      }
    },
    ID2 (value) {
      start(`;[_token, _text] = match`)
      mid(value)
      end(`(_text)`)
    },
    STRING (value) {
      start(`;[_token, _text] = _matchLITERAL(_text, '`)
      mid(value)
      end(`')`)
      out(`if (_token !== null) _token = false // Discard literal`)
    },
    LITERAL (value) {
      if (value === '.ID') {
        out(`;[_token, _text] = _matchID(_text)`)
      }
    },
    REPEAT (term) {
      out(`// Consume 0 or more times`)
      out(`while (true) {`)
      end()
      indent++
      call(term)
      out(`if (_token === null) { break } else { _token && token.push(_token) }`)
      end()
      indent--
      out(`}`)
      end()
    }
  }

  call(ast)

  return text
}
