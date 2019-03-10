export function attachComputer (computer) {
  document.getElementById('step').addEventListener('click', () => {
    computer.reset_0 = 0;
    computer.tick();
    computer.tick();
    computer.tock();
    computer.tick();
    computer.tick();
  });

  document.getElementById('reset').addEventListener('click', () => {
    computer.reset_0 = 1;
    computer.tick();
    computer.tock();
    computer.tick();
  });
}