const reverse = (str) => {
  const a = str.split('');
  a.reverse();
  return a.join('')
}

export function monitorROM (computer) {
  document.getElementById("load").addEventListener('change', function () {
    let file = this.files[0]
    if (!file) return
    let fr = new FileReader();
    fr.addEventListener('loadend', function () {
      const memory = computer.ROM32K_2.memory
      memory.fill(0);
      let vals = fr.result.trim().split('\n').map(
        line => parseInt(reverse(line.trim()), 2)
      )
      for (let i = 0; i < vals.length; i++) {
        memory[i] = vals[i];
      }
    })
    fr.readAsText(file)
  })
}