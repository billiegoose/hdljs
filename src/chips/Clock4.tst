// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/03/a/Bit.tst

load Clock4.hdl,
output-file Clock4.out,
compare-to Clock4.cmp,
output-list time%S1.4.1 reset%B3.1.2 pulseClock%B5.1.4 state0%B3.1.2 state1%B3.1.2 state2%B3.1.2 state3%B3.1.2;

set reset 1,
set pulseClock 1,
tick, tock, output;
set reset 0,
tick, tock, output;
tick, tock, output;
tick, tock, output;
set reset 1,
tick, tock, output;
set reset 0,
tick, tock, output;
tick, tock, output;
tick, tock, output;
set reset 1,
tick, tock, output;
tick, tock, output;
tick, tock, output;
set reset 0,
tick, tock, output;
tick, tock, output;
tick, tock, output;
tick, tock, output;
tick, tock, output;
tick, tock, output;

set reset 1,
set pulseClock 1,
tick, tock, output;
set reset 0,
set pulseClock 0,
tick, tock, output;
tick, tock, output;
tick, tock, output;

set pulseClock 1,
tick, tock, output;
set pulseClock 0,
tick, tock, output;
tick, tock, output;
tick, tock, output;

set pulseClock 1,
tick, tock, output;
set pulseClock 0,
tick, tock, output;
tick, tock, output;
tick, tock, output;

set pulseClock 1,
tick, tock, output;
set pulseClock 0,
tick, tock, output;
tick, tock, output;
tick, tock, output;

set pulseClock 1,
tick, tock, output;
set pulseClock 0,
tick, tock, output;
tick, tock, output;
tick, tock, output;