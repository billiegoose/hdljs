
const reverse = (str) => {
  const a = str.split('');
  a.reverse();
  return a.join('')
}

document.getElementById("load").addEventListener('change', function () {
  console.log('hhhhh')
  let file = this.files[0]
  console.log(file)
  if (!file) return
  let fr = new FileReader();
  fr.addEventListener('loadend', function () {
    global.ROM = fr.result.trim().split('\n').map(
      line => parseInt(reverse(line.trim()), 2)
    )
    console.log(global.ROM);
  })
  fr.readAsText(file)
})
