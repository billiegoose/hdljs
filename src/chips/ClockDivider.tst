// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/03/a/Bit.tst

load ClockDivider.hdl,
output-file ClockDivider.out,
compare-to ClockDivider.cmp,
output-list time%S1.4.1 reset%B3.1.3 max%B1.16.1 out%B2.1.2;

set reset 1,
set max 0,
tick, tock, output;
set reset 0,
tick, tock, output;
tick, tock, output;
tick, tock, output;
tick, tock, output;

set reset 1,
set max 1,
tick, tock, output;
set reset 0,
tick, tock, output;
tick, tock, output;
tick, tock, output;
tick, tock, output;
tick, tock, output;
tick, tock, output;
tick, tock, output;
tick, tock, output;

set max 3,
tick, tock, output;
tick, tock, output;
tick, tock, output;

tick, tock, output;
tick, tock, output;
tick, tock, output;
tick, tock, output;

tick, tock, output;
tick, tock, output;
tick, tock, output;
tick, tock, output;

tick, tock, output;
tick, tock, output;
tick, tock, output;
tick, tock, output;

tick, tock, output;
tick, tock, output;
tick, tock, output;
tick, tock, output;

tick, tock, output;
set reset 1,
tick, tock, output;
set reset 0,
tick, tock, output;
tick, tock, output;
tick, tock, output;

tick, tock, output;
tick, tock, output;
tick, tock, output;
