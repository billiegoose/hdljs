/* eslint-env jest */
import fs from 'fs'
import { matchSYNTAX, compileParser } from './matchSYNTAX.mjs'

const demo = fs.readFileSync('grammar.cpeg', 'utf8')

describe('test', () => {
  const ast = matchSYNTAX(demo)[0]

  it("parser hasn't broken", () => {
    expect(ast).toMatchSnapshot()
  })
  it("compiler hasn't broken", () => {
    expect(true).toBe(true)
    console.log(compileParser(ast))
  })
})

