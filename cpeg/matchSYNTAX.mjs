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

export { matchSYNTAX }

function matchSYNTAX (text) {
  let _token, _text = text

  let token = node('SYNTAX')
  // Consume (or backtrack)
  ;[_token, _text] = _matchLITERAL(_text, '.SYNTAX')
  if (_token === null) { return [null, text] } else { token.push(_token) }

  // Discard
  token.pop()

  // Consume (or throw)
  ;[_token, _text] = _matchID(_text)
  if (_token === null) { throw new Error(text) } else { token.push(_token) }

  // Consume (or throw)
  ;[_token, _text] = matchRULES(_text)
  if (_token === null) { throw new Error(text) } else { token.push(_token) }

  // Consume (or throw)
  ;[_token, _text] = _matchLITERAL(_text, '.END')
  if (_token === null) { throw new Error(text) } else { token.push(_token) }

  // Discard
  token.pop()

  return [token, _text]
}

function matchRULES (text) {
  let _token, _text = text

  let token = node('RULES')
  // Consume 0 or more times
  while (true) {

    // Consume (or continue)
    ;[_token, _text] = matchRULE(_text)
    if (_token === null) { break } else { token.push(_token) }

  }

  return [token, _text]
}

function matchRULE (text) {
  let _token, _text = text

  let token = node('RULE')
  // Consume (or backtrack)
  ;[_token, _text] = _matchID(_text)
  if (_token === null) { return [null, text] } else { token.push(_token) }

  // Consume (or throw)
  ;[_token, _text] = _matchLITERAL(_text, '=')
  if (_token === null) { throw new Error(text) } else { token.push(_token) }

  // Discard
  token.pop()

  // Consume (or throw)
  ;[_token, _text] = matchRULEEX(_text)
  if (_token === null) { throw new Error(text) } else { token.push(_token) }

  // Consume (or throw)
  ;[_token, _text] = _matchLITERAL(_text, ';')
  if (_token === null) { throw new Error(text) } else { token.push(_token) }

  // Discard
  token.pop()

  return [token, _text]
}

function matchRULEEX (text) {
  let _token, _text = text

  let token = node('EXP')
  // Consume (or backtrack)
  ;[_token, _text] = matchEX1(_text)
  if (_token === null) { return [null, text] } else { token.push(_token) }

  return [token, _text]
}

function matchEX1 (text) {
  let _token, _text = text

  let token = node('ALT')
  // Consume (or backtrack)
  ;[_token, _text] = matchEX2(_text)
  if (_token === null) { return [null, text] } else { token.push(_token) }

  // Consume 0 or more times
  while (true) {

    // Consume (or continue)
    ;[_token, _text] = _matchLITERAL(_text, '/')
    if (_token === null) { break } else { token.push(_token) }

    // Discard
    token.pop()

    // Consume (or error)
    ;[_token, _text] = matchEX2(_text)
    if (_token === null) { throw new Error(_text) } else { token.push(_token) }

  }

  return [token, _text]
}

function matchEX2 (text) {
  let _token, _text = text

  let token = node('SEQ')
  // Consume (or backtrack)
  ;[_token, _text] = matchEX3(_text)
  if (_token === null) { return [null, text] } else { token.push(_token) }

  // Consume 0 or more times
  while (true) {

    // Consume (or continue)
    ;[_token, _text] = matchEX3(_text)
    if (_token === null) { break } else { token.push(_token) }

  }

  return [token, _text]
}

function matchEX3 (text) {
  let _token, _text = text

  let token = node('TERM')
  {
    let __text = _text
    for (let i = 0; i <= 9; i++) {
      let breakFor = false
      switch (i) {
        case 0: {
          // Consume (or try next)
          ;[_token, __text] = _matchID(_text)
          if (_token === null) { continue } else { token.push(_token) }
          breakFor = true
          break
        }
        case 1: {
          // Consume (or try next)
          ;[_token, __text] = _matchSTRING(_text)
          if (_token === null) { continue } else { token.push(_token) }
          breakFor = true
          break
        }
        case 2: {
          // Consume (or try next)
          ;[_token, __text] = _matchLITERAL(_text, '.ID')
          if (_token === null) { continue } else { token.push(_token) }
          breakFor = true
          break
        }
        case 3: {
          // Consume (or try next)
          ;[_token, __text] = _matchLITERAL(_text, '.NUMBER')
          if (_token === null) { continue } else { token.push(_token) }
          breakFor = true
          break
        }
        case 4: {
          // Consume (or try next)
          ;[_token, __text] = _matchLITERAL(_text, '.STRING')
          if (_token === null) { continue } else { token.push(_token) }
          breakFor = true
          break
        }
        case 5: {
          // Consume (or try next)
          let subtoken = node('GROUP')

          // Consume (or backtrack)
          ;[_token, __text] = _matchLITERAL(_text, '(')
          if (_token === null) { continue } else { subtoken.push(_token) }

          // Discard
          subtoken.pop()

          // Consume (or throw)
          ;[_token, __text] = matchEX1(__text)
          if (_token === null) { throw new Error(_text) } else { subtoken.push(_token) }

          // Consume (or throw)
          ;[_token, __text] = _matchLITERAL(__text, ')')
          if (_token === null) { throw new Error(_text) } else { subtoken.push(_token) }

          // Discard
          subtoken.pop()

          token.push(subtoken)
          breakFor = true
          break
        }
        case 6: {
          // Consume (or try next)
          let subtoken = node('TYPE')

          // Consume (or backtrack)
          ;[_token, __text] = _matchLITERAL(_text, '{')
          if (_token === null) { continue } else { subtoken.push(_token) }

          // Discard
          subtoken.pop()

          // Consume (or throw)
          ;[_token, __text] = matchEX1(__text)
          if (_token === null) { throw new Error(text) } else { subtoken.push(_token) }

          // Consume (or backtrack)
          ;[_token, __text] = _matchLITERAL(__text, ':')
          if (_token === null) { throw new Error(text) } else { subtoken.push(_token) }

          // Discard
          subtoken.pop()

          // Consume (or throw)
          ;[_token, __text] = _matchID(__text)
          if (_token === null) { throw new Error(text) } else { subtoken.push(_token) }

          // Consume (or backtrack)
          ;[_token, __text] = _matchLITERAL(__text, '}')
          if (_token === null) { throw new Error(text) } else { subtoken.push(_token) }

          // Discard
          subtoken.pop()

          token.push(subtoken)
          breakFor = true
          break
        }
        case 7: {
          // Consume (or try next)
          ;[_token, __text] = _matchLITERAL(_text, '.EMPTY')
          if (_token === null) { continue } else { token.push(_token) }
          breakFor = true
          break
        }
        case 8: {
          // Consume (or try next)
          let subtoken = node('REPEAT')

          // Consume (or backtrack)
          ;[_token, __text] = _matchLITERAL(_text, '$')
          if (_token === null) { continue } else { subtoken.push(_token) }

          // Discard
          subtoken.pop()

          // Consume (or throw)
          ;[_token, __text] = matchEX3(__text)
          if (_token === null) { throw new Error(text) } else { subtoken.push(_token) }

          token.push(subtoken)
          breakFor = true
          break
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

  return [token, _text]
}

