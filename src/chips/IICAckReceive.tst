// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/03/a/Bit.tst

load IICAckReceive.hdl,
output-file IICAckReceive.out,
compare-to IICAckReceive.cmp,
output-list time%S1.4.1 clock0%B6.1.5 reset%B3.1.3 sda%B2.1.2 scl%B2.1.2 done%B2.1.2;

set reset 1,
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
set reset 1,
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
