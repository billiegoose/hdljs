// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/03/a/Bit.tst

load Clock8.hdl,
output-file Clock8.out,
compare-to Clock8.cmp,
output-list time%S1.4.1 pulseClock%B5.1.4 reset%B3.1.1 begin%B3.1.1 state0%B3.1.2 state1%B3.1.2 state2%B3.1.2 state3%B3.1.2 state4%B3.1.2 state5%B3.1.2 state6%B3.1.2 state7%B3.1.2 carry%B2.1.2;

set reset 1,
set pulseClock 1,
tick, tock, output;
set reset 0,
tick, tock, output;
tick, tock, output;
tick, tock, output;
set begin 1,
tick, tock, output;
set begin 0,
tick, tock, output;
set reset 1,
tick, tock, output;
set reset 0,
tick, tock, output;
tick, tock, output;
tick, tock, output;
set begin 1,
tick, tock, output;
set begin 0,
tick, tock, output;
tick, tock, output;
tick, tock, output;
tick, tock, output;
tick, tock, output;
tick, tock, output;
tick, tock, output;
set begin 1,
tick, tock, output;
set begin 0,
tick, tock, output;
tick, tock, output;
tick, tock, output;
tick, tock, output;
tick, tock, output;
tick, tock, output;

set begin 1,
set pulseClock 1,
tick, tock, output;
set begin 0,
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

set pulseClock 1,
tick, tock, output;
set pulseClock 0,
tick, tock, output;
tick, tock, output;
tick, tock, output;