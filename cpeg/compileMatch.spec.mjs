/* eslint-env jest */
import fs from 'fs'
import { matchSYNTAX } from './matchSYNTAX.mjs'
import { compileMatch } from './compileMatch.mjs'

const demo = fs.readFileSync('grammar.cpeg', 'utf8')

describe('compiler', () => {
  const ast = matchSYNTAX(demo)[0]

  it("compiler hasn't broken", () => {
    expect(true).toBe(true)
    console.log(compileMatch(ast))
  })
})

