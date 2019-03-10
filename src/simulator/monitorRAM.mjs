export function monitorRAM (computer) {
  const r0 = document.getElementById('r0');
  const r1 = document.getElementById('r1');
  const r2 = document.getElementById('r2');
  const r3 = document.getElementById('r3');
  const r4 = document.getElementById('r4');
  const r5 = document.getElementById('r5');
  const r6 = document.getElementById('r6');
  const r7 = document.getElementById('r7');
  const r8 = document.getElementById('r8');
  const r9 = document.getElementById('r9');
  const r10 = document.getElementById('r10');
  const r11 = document.getElementById('r11');
  const r12 = document.getElementById('r12');
  const r13 = document.getElementById('r13');
  const r14 = document.getElementById('r14');
  const r15 = document.getElementById('r15');

  const updateScreen = () => {
    requestAnimationFrame(updateScreen);
    r0.textContent = computer.Memory_1.RAM16K_4.memory[0];
    r1.textContent = computer.Memory_1.RAM16K_4.memory[1];
    r2.textContent = computer.Memory_1.RAM16K_4.memory[2];
    r3.textContent = computer.Memory_1.RAM16K_4.memory[3];
    r4.textContent = computer.Memory_1.RAM16K_4.memory[4];
    r5.textContent = computer.Memory_1.RAM16K_4.memory[5];
    r6.textContent = computer.Memory_1.RAM16K_4.memory[6];
    r7.textContent = computer.Memory_1.RAM16K_4.memory[7];
    r8.textContent = computer.Memory_1.RAM16K_4.memory[8];
    r9.textContent = computer.Memory_1.RAM16K_4.memory[9];
    r10.textContent = computer.Memory_1.RAM16K_4.memory[10];
    r11.textContent = computer.Memory_1.RAM16K_4.memory[11];
    r12.textContent = computer.Memory_1.RAM16K_4.memory[12];
    r13.textContent = computer.Memory_1.RAM16K_4.memory[13];
    r14.textContent = computer.Memory_1.RAM16K_4.memory[14];
    r15.textContent = computer.Memory_1.RAM16K_4.memory[15];
  }
  requestAnimationFrame(updateScreen);
}
