# spi-keyboard

## Purpose

This is a purpose-built application for converting Keyboard (and hopefully one day Mouse) events into a form that can be consumed
by my FPGA CPU design.

## Implementation Details

It implements an SPI slave device (via bitbanging the GPIO pins of a Raspberry Pi) because the regular SPI
drivers for Raspberry Pis are all written for being a SPI master, but I only have FPGA code for an SPI master, so forced to either
implement an SPI slave in Verilog or in Python/C I chose the latter. (Actually it ended up being Go! Some smart Googler's apparently
made the Go GPIO library work at 80MHz so I went with that. Actual real-life performance seems closer to 1MHz but that's still pretty
good. And I think Go is easier to work with than C probably.)

It emits keyboard scancodes in my novel ASKEE (A Simple Keyboard Event Encoding) code. The first 6 bits encodes 64 possible keyboard buttons
(less than the 104 typical of most IBM heritage keyboards, but enough to be useful); a high 7th bit encodes that the Shift key is held down;
and a high 8th bit indicates a key release (as opposed to a key press).