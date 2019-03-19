// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/03/a/Bit.tst

load IICByte.hdl,
output-file IICByte.out,
compare-to IICByte.cmp,
output-list time%S1.4.1 pulseClock%B6.1.5 begin%B3.1.3 in%B1.8.1 sda%B2.1.2 scl%B2.1.2 bitReady%B4.1.5 ready%B3.1.3;

set pulseClock 1,
set begin 0,
set in 0,

tick, output;
tock, output;

set pulseClock 1,
set begin 0,
set in 0,

tick, output;
tock, output;

set pulseClock 1,
set begin 1,
set in 0,

tick, output;
tock, output;

set pulseClock 1,
set begin 0,
set in 0,

tick, output;
tock, output;
tick, output;
tock, output;

tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;

tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;

tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;

tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;

tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;

tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;

tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;

tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;

tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;

set in %B10000001,
tick, output;
tock, output;
set begin 1,
tick, output;
tock, output;

tick, output;
tock, output;
set begin 0,
tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;

tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;

tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;

tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;

tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;

tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;

tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;

tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;

tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;

tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;

set in %B01010101,
tick, output;
tock, output;
tick, output;
tock, output;
set begin 1,

tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
set begin 0,
tock, output;
tick, output;
tock, output;

tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;

tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;

tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;

tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;

tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;

tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;

tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;

tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;

tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;
tick, output;
tock, output;
