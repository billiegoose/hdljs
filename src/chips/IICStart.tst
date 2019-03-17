// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/03/a/Bit.tst

load IICStart.hdl,
output-file IICStart.out,
compare-to IICStart.cmp,
output-list time%S1.4.1 pulseClock%B6.1.5 begin%B3.1.3 sda%B2.1.2 scl%B2.1.2 ready%B3.1.3;

set pulseClock 1,
set begin 0,
tick,
output;

tock,
output;

set pulseClock 1,
set begin 0,
tick,
output;

tock,
output;

set pulseClock 1,
set begin 1,
tick,
output;

tock,
output;

set pulseClock 1,
set begin 0,
tick,
output;

tock,
output;

set pulseClock 1,
set begin 0,
tick,
output;

tock,
output;

set pulseClock 1,
set begin 0,
tick,
output;

tock,
output;

set pulseClock 1,
set begin 0,
tick,
output;

tock,
output;

set pulseClock 1,
set begin 0,
tick,
output;

tock,
output;

set pulseClock 1,
set begin 0,
tick,
output;

tock,
output;

set pulseClock 1,
set begin 0,
tick,
output;

tock,
output;

set pulseClock 1,
set begin 0,
tick,
output;

tock,
output;

set pulseClock 1,
set begin 1,
tick,
output;

tock,
output;

set pulseClock 1,
set begin 1,
tick,
output;

tock,
output;

set pulseClock 1,
set begin 1,
tick,
output;

tock,
output;

set pulseClock 1,
set begin 0,
tick,
output;

tock,
output;

set pulseClock 1,
set begin 0,
tick,
output;

tock,
output;

set pulseClock 1,
set begin 0,
tick,
output;

tock,
output;

set pulseClock 1,
set begin 0,
tick,
output;

tock,
output;
