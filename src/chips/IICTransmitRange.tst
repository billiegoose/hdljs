load IICTransmitRange.hdl,
output-file IICTransmitRange.out,
compare-to IICTransmitRange.cmp,
// output-list time%S1.8.1 reset%B3.1.3  clock0%B4.1.4 stateRegister%B3.7.3 byte%X2.2.2 sda%B2.1.2 scl%B2.1.2,
output-list time%S1.8.1 reset%B3.1.3 startAt%B1.16.1 stopAt%B1.16.1 sendStart%B4.1.4 sendStop%B4.1.4 sda%B2.1.2 scl%B2.1.2 address%B1.16.1 done%B2.1.2,

ROM32K load IICTransmitRange.hack,

set startAt 0,
set stopAt 2,
set sendStart 1,
set sendStop 1,
set reset 1,
tick, tock, output;
set reset 0,
tick, tock, output;

// IICStart
repeat 61 {tick, tock;} output;
tick, tock, output;
repeat 62 {tick, tock;} output;
tick, tock, output;
repeat 62 {tick, tock;} output;
tick, tock, output;
repeat 62 {tick, tock;} output;
tick, tock, output;

// IICByte 0
tick, tock, output;

repeat 61 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 61 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;


// ACK 0

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;


// IICByte 1
tick, tock, output;

repeat 61 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 61 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;


// ACK 1
repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

// IICByte 0
tick, tock, output;

repeat 61 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 61 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;


// ACK 0

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;


// IICByte 1
tick, tock, output;

repeat 61 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 61 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;


// ACK 1
repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;


// STOP 
repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;

repeat 62 {tick, tock;} output;
tick, tock, output;