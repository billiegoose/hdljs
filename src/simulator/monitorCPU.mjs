function get16bitnum (object, name) {
  return (
    object[`${name}_0`] +
    object[`${name}_1`] * 2 +
    object[`${name}_2`] * 4 +
    object[`${name}_3`] * 8 +
    object[`${name}_4`] * 16 +
    object[`${name}_5`] * 32 +
    object[`${name}_6`] * 64 +
    object[`${name}_7`] * 128 +
    object[`${name}_8`] * 256 +
    object[`${name}_9`] * 512 +
    object[`${name}_10`] * 1024 +
    object[`${name}_11`] * 2048 +
    object[`${name}_12`] * 4096 +
    object[`${name}_13`] * 8192 +
    object[`${name}_14`] * 16384
  );
}

export function monitorCPU (computer) {
  const instruction = document.getElementById('instruction');
  const a = document.getElementById('a-reg');
  const d = document.getElementById('d-reg');
  const inM = document.getElementById('m-in');
  const outM = document.getElementById('m-out');
  const addressM = document.getElementById('m-addr');
  const pc = document.getElementById('pc');
  const updateScreen = () => {
    requestAnimationFrame(updateScreen);
    instruction.textContent = get16bitnum(computer, 'instruction');
    a.textContent = get16bitnum(computer.CPU_0, 'A');
    d.textContent = get16bitnum(computer.CPU_0, 'D');
    inM.textContent = get16bitnum(computer.CPU_0, 'inM');
    outM.textContent = get16bitnum(computer.CPU_0, 'outM');
    addressM.textContent = get16bitnum(computer.CPU_0, 'addressM');
    pc.textContent = get16bitnum(computer, 'pc');
  }
  requestAnimationFrame(updateScreen);
}

