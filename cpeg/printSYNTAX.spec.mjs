/* eslint-env jest */
import fs from 'fs'
import { matchSYNTAX } from './matchSYNTAX.mjs'
import { printSYNTAX } from './printSYNTAX.mjs'

const demo = fs.readFileSync('grammar.cpeg', 'utf8')

describe('test', () => {
  const ast = matchSYNTAX(demo)[0]

  it("printer hasn't broken", () => {
    expect(printSYNTAX(ast)).toBe(`.SYNTAX SYNTAX
SYNTAX = { '.SYNTAX' .ID RULES '.END' : SYNTAX } ;
RULES = { $ RULE : RULES } ;
RULE = { .ID '=' RULEEX ';' : RULE } ;
RULEEX = { EX1 : EXP } ;
EX1 = { EX2 $ ( '/' EX2 ) : ALT } ;
EX2 = { EX3 $ EX3 : SEQ } ;
EX3 = .ID
    / { .STRING : LITERAL }
    / { '.ID' : ID }
    / { '.NUMBER' : NUMBER }
    / { '.STRING' : STRING }
    / { '(' EX1 ')' : GROUP }
    / { '{' EX1 ':' .ID '}' : TYPE }
    / '.EMPTY'
    / { '$' EX3 : REPEAT } ;`)
  })
})
