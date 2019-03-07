export function pinName(name, i) {
  switch(name) {
    case 'true':
    case '1': {
      return '1';
    }
    case 'false':
    case '0': {
      return '0';
    }
    default: {
      return `${name}_${i}`
    }
  }
}