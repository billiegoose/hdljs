export default class SymbolTable {
  constructor() {
    this.table = new Map([
      ['SP', 0x0000],
      ['LCL', 0x0001],
      ['ARG', 0x0002],
      ['THIS', 0x0003],
      ['THAT', 0x0004],
      ['SCREEN', 0x4000],
      ['KBD', 0x60000]
    ])
    for (let i = 0; i < 16; i++) {
      this.table.set(`R${i}`, i)
    }
    this.nextAvailableVariableAddress = 16
  }
  /**
   * 
   * @param {string} symbol 
   * @param {number} address 
   */
  addEntry(symbol, address) {
    this.table.set(symbol, address)
  }
  /**
   * 
   * @param {string} symbol 
   */
  contains(symbol) {
    return this.table.has(symbol)
  }
  /**
   * 
   * @param {string} symbol 
   */
  getAddress(symbol) {
    return this.table.get(symbol)
  }
  /**
   * 
   * @param {string} symbol 
   */
  addVariable(symbol) {
    this.table.set(symbol, this.nextAvailableVariableAddress)
    this.nextAvailableVariableAddress++
  }
}