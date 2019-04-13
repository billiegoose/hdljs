// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/03/a/Bit.tst

load IICState.hdl,
output-file IICState.out,
compare-to IICState.cmp,
output-list time%S1.4.1 reset%B3.1.3 inc%B2.1.2 out%B1.16.1;

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
