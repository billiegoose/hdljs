export class PinHeader {
  constructor(str) {
    this.parse(str)
    this.__str = str
  }
  parse(str) {
    const match = /^(?<name>\w+)(\[(?<width>\d+)\])?$/.exec(str)
    const { name, width = 1 } = match.groups
    this.name = name;
    this.width = parseInt(width);
    this.start = 0;
    this.end = width - 1;
    this.implicit = false;
  }
  print () {
    return `${this.name}${this.width > 1 ? `[${this.width}]` : ''}`
  }
  clone () {
    let ph = new PinHeader(this.__str)
    Object.assign(ph, this);
    return ph;
  }
}
