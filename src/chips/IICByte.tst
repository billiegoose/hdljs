// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/03/a/Bit.tst

load IICByte.hdl,
output-file IICByte.out,
// compare-to IICByte.cmp,
output-list time%S1.4.1 clock0%B6.1.5 in%B1.8.1 sda%B2.1.2 scl%B2.1.2 done%B3.1.3 clock0%B2.1.2 clock1%B2.1.2 clock2%B2.1.2 clock3%B2.1.2 clock4%B2.1.2;

set reset 1,
set in %B00000000,
set clock0 0, tick, tock, output;
set reset 0,
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;

set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;

set reset 1,
set in %B10000001,
set clock0 0, tick, tock, output;
set reset 0,
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;

set reset 1,
set in %B01010101,
set clock0 0, tick, tock, output;
set reset 0,
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
set clock0 0, tick, tock, output;
set clock0 1, tick, tock, output;
