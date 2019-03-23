// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/03/a/Bit.tst

load Equal.hdl,
output-file Equal.out,
compare-to Equal.cmp,
output-list a%B1.16.1 b%B1.16.1 out%B2.1.2;

set a %B0000000000000000,
set b %B0000000000000000,
tick, tock, output;

set a %B0000000000000000,
set b %B1111111111111111,
tick, tock, output;

set a %B1111111111111111,
set b %B1111111111111111,
tick, tock, output;

set a %B1010101010101010,
set b %B0101010101010101,
tick, tock, output;

set a %B1010101010101010,
set b %B1010101010101010,
tick, tock, output;

set a %B0011110011000011,
set b %B0000111111110000,
tick, tock, output;

set a %B0001001000110100,
set b %B1001100001110110,
tick, tock, output;

set a %B0011110011000011,
set b %B0011110011000011,
tick, tock, output;
