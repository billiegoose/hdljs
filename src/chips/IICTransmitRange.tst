load IICTransmitRange.hdl,
output-file IICTransmitRange.out,
// compare-to IICTransmitRange.cmp,
//output-list time%S1.8.1 reset%B3.1.3 sda%B2.1.2 scl%B2.1.2 pc%D1.3.1 stateRegister%B3.7.3 byte%X2.2.2 inc%B4.1.4 jump%B3.1.3 
output-list time%S1.8.1 reset%B3.1.3  clock0%B4.1.4 startClock%B5.1.5 anyByteClock%B5.1.5 stateRegister%B3.7.3 byte%X2.2.2 byte0State%B5.1.5 byte1State%B5.1.5 byteDone%B5.1.5 byteDoneSignal%B5.1.5 beginAck%B5.1.5 anyAckState%B5.1.5 ackDone%B5.1.5 ackDoneSignal%B5.1.5 sdaByte%B5.1.5 sclByte%B5.1.5 sdaAck%B4.1.4 sclAck%B4.1.4,
//atStart%B4.1.4 startDone%B4.1.4 byteDone%B4.1.4 ackDone%B4.1.4 stopDone%B4.1.4 atStop%B4.1.4;

ROM32K load IICTransmitRange.hack,

set startAt 0,
set stopAt 1,
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