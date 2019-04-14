// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/03/a/Bit.tst

load IICState.hdl,
output-file IICState.out,
compare-to IICState.cmp,
output-list time%S1.4.1 reset%B3.1.3 inc%B2.1.2 addr%D2.6.2 jump%B2.1.2 out%B1.16.1;

set reset 1,
set inc 0, tick, tock, output;
set reset 0,
set inc 1, tick, tock, output;
set inc 1, tick, tock, output;
set inc 1, tick, tock, output;
set inc 1, tick, tock, output;
set inc 1, tick, tock, output;
set inc 1, tick, tock, output;
set inc 1, tick, tock, output;
set inc 1, tick, tock, output;
set inc 1, tick, tock, output;
set inc 1, tick, tock, output;
set inc 1, tick, tock, output;
set inc 1, tick, tock, output;
set inc 1, tick, tock, output;
set inc 1, tick, tock, output;
set inc 1, tick, tock, output;
set reset 1,
set inc 1, tick, tock, output;
set reset 0,
set inc 1, tick, tock, output;
set inc 1, tick, tock, output;
set inc 1, tick, tock, output;
set inc 1, tick, tock, output;
set inc 1, tick, tock, output;
set reset 1,
set inc 1, tick, tock, output;
set reset 0,
set inc 1, tick, tock, output;
set inc 1, tick, tock, output;
set reset 1,
set inc 1, tick, tock, output;
set inc 1, tick, tock, output;
set inc 1, tick, tock, output;
set reset 0,
set inc 1, tick, tock, output;
set inc 0, tick, tock, output;
set inc 1, tick, tock, output;
set inc 0, tick, tock, output;
set inc 1, tick, tock, output;
set inc 0, tick, tock, output;
set inc 1, tick, tock, output;
set inc 0, tick, tock, output;

set addr 2,
set jump 1, tick, tock, output;
set jump 0,
set inc 1, tick, tock, output;
set inc 1, tick, tock, output;
set inc 1, tick, tock, output;
set inc 1, tick, tock, output;
set inc 1, tick, tock, output;
set addr 1024,
set jump 1,
set inc 1, tick, tock, output;
set jump 0,
set inc 1, tick, tock, output;
set inc 1, tick, tock, output;
set inc 1, tick, tock, output;
set inc 1, tick, tock, output;
set inc 1, tick, tock, output;
set addr -32768,
set jump 1,
set reset 1,
set inc 1, tick, tock, output;
set addr 16384,
set jump 1,
set reset 1,
set inc 1, tick, tock, output;
set addr 8192,
set jump 1,
set reset 1,
set inc 1, tick, tock, output;
set addr 4096,
set jump 1,
set reset 1,
set inc 1, tick, tock, output;
set addr 4096,
set jump 0,
set reset 1,
set inc 1, tick, tock, output;
set addr 4096,
set jump 0,
set reset 0,
set inc 1, tick, tock, output;
set addr 4096,
set jump 0,
set reset 0,
set inc 0, tick, tock, output;