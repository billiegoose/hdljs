// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/03/a/Bit.tst

load IICByte.hdl,
output-file IICByte.out,
// compare-to IICByte.cmp,
output-list time%S1.4.1 pulseClock%B6.1.5 begin%B3.1.3 in%B1.8.1 sda%B2.1.2 scl%B2.1.2 ready%B3.1.3 substate0%B4.1.4 substate1%B4.1.4 substate2%B4.1.4 substate3%B4.1.4 state0%B3.1.2 state1%B3.1.2 state2%B3.1.2 state3%B3.1.2 state4%B3.1.2 state5%B3.1.2 state6%B3.1.2 state7%B3.1.2;

set reset 0,
set pulseClock 1,
set begin 0,
set in 0,
tick, tock, output;

set pulseClock 1,
set begin 0,
set in 0,
tick, tock, output;

set pulseClock 1,
set begin 1,
set in 0,
tick, tock, output;

set pulseClock 1,
set begin 0,
set in 0,
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

set in %B10000001,
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

set in %B01010101,
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
