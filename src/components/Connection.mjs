export class Connection {
  constructor(str) {
    this.parse(str)
  }
  parse(str) {
    const [int, ext] = str.split('=');
    this.int = new Bus(int);
    this.ext = new Bus(ext);
  }
}

export class Bus {
  constructor(str) {
    this.implicit = true;
    this.parse(str)
  }
  parse(str) {
    const match = /^(?<name>\w+)(?<body>\[.*\])?$/.exec(str)
    const { name, body } = match.groups;
    this.name = name;
    if (body) {
      const match = /^\[(?<start>\d+)(\.\.(?<end>\d+))?\]$/.exec(body)
      const { start, end = start } = match.groups
      this.start = parseInt(start);
      this.end = parseInt(end);
    } else {
      this.start = 0;
    }
  }
  set end (value) {
    this._end = value;
    this.implicit = false
  }
  get end () {
    return this._end;
  }
  get width () {
    if (this.implicit) return;
    return this.end - this.start + 1;
  }
  print () {
    if (this.start === 0 && this.end === 0) {
      return this.name
    } else if (this.start === this.end) {
      return `${this.name}[${this.start}]`
    } else {
      return `${this.name}[${this.start}..${this.end}]`
    }
  }
}