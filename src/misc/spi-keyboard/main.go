package main

import (
  "fmt"
  "github.com/MarinX/keylogger"
  "github.com/nsf/termbox-go"
  "periph.io/x/periph/conn/gpio"
  "periph.io/x/periph/host"
  "periph.io/x/periph/host/bcm283x"
)

var keyCodeMap = map[uint16]uint8 {
  1: 0x3E,
  2: 0x01,
  3: 0x02,
  4: 0x03,
  5: 0x04,
  6: 0x05,
  7: 0x06,
  8: 0x07,
  9: 0x08,
  10: 0x09,
  11: 0x00,
  12: 0x25,
  13: 0x26,
  14: 0x32,
  15: 0x30,
  16: 0x1A,
  17: 0x20,
  18: 0x0E,
  19: 0x1B,
  20: 0x1D,
  21: 0x22,
  22: 0x1E,
  23: 0x12,
  24: 0x18,
  25: 0x19,
  26: 0x27,
  27: 0x28,
  28: 0x31,
  29: 0x3D,
  30: 0x0A,
  31: 0x1C,
  32: 0x0D,
  33: 0x0F,
  34: 0x10,
  35: 0x11,
  36: 0x13,
  37: 0x14,
  38: 0x15,
  39: 0x2A,
  40: 0x2B,
  41: 0x24,
  42: 0x7F,
  44: 0x23,
  45: 0x21,
  46: 0x0C,
  47: 0x1F,
  48: 0x0B,
  49: 0x17,
  50: 0x16,
  51: 0x2C,
  52: 0x2D,
  53: 0x2E,
  54: 0x7F,
  55: 0x48,
  56: 0x3C,
  57: 0x2F,
  71: 0x38,
  72: 0x08,
  73: 0x09,
  74: 0x25,
  75: 0x04,
  76: 0x05,
  77: 0x06,
  78: 0x66,
  79: 0x01,
  80: 0x34,
  81: 0x03,
  83: 0x37,
  96: 0x31,
  97: 0x3D,
  98: 0x2E,
  100: 0x3C,
  102: 0x38,
  103: 0x33,
  104: 0x3A,
  105: 0x35,
  106: 0x36,
  107: 0x39,
  108: 0x34,
  109: 0x3B,
  111: 0x37,
}

var shiftBit gpio.Level = gpio.Low

func WriteKeyEvent(e keylogger.InputEvent) {
  code, ok := keyCodeMap[e.Code]
  if !ok {
    return
  }

  MISO := bcm283x.GPIO10 // purple wire
  CS := bcm283x.GPIO9   // blue wire
  CLK := bcm283x.GPIO11  // brown wire

  clk := gpio.Low
  _clk := gpio.Low

  keypress := e.KeyPress()
  keyrelease := e.KeyRelease()

  var bits [9]gpio.Level
  // send in MSB order
  if keyrelease {
    bits[0] = gpio.High // Key release
  } else {
    bits[0] = gpio.Low // Key press
  }
  if keypress && code == 0x7F {
    shiftBit = gpio.High
  }
  bits[1] = shiftBit // Shift key
  if keyrelease && code == 0x7F {
    shiftBit = gpio.Low
  }
  bits[2] = (code >> 5) & 1 == 1
  bits[3] = (code >> 4) & 1 == 1
  bits[4] = (code >> 3) & 1 == 1
  bits[5] = (code >> 2) & 1 == 1
  bits[6] = (code >> 1) & 1 == 1
  bits[7] = code & 1 == 1
  bits[8] = gpio.Low // Return signal to low

  bitToSend := bits[0]
  bitIndex := 0


  // wait until next chip select event
  for {
    cs := CS.FastRead()
    if !cs {
      break
    }
  }
  // Immediately put out first bit so it's read on the next rising edge
  MISO.FastOut(bitToSend)
  bitIndex += 1
  bitToSend = bits[bitIndex]
  // watch clock, output bits to send on MISO
  for {
    clk = CLK.FastRead()
    if _clk && !clk {
      MISO.FastOut(bitToSend)

      bitIndex += 1
      if bitIndex == 9 {
        break
      }
      bitToSend = bits[bitIndex]
    }
    _clk = clk
  }

  // print pretty message
  if keyrelease {
    code |= 0x80
  }
  if shiftBit {
    code |= 0x40
  }
  fmt.Printf("code = %X\n", code)
}

func main() {
  // The "keyboard" name heuristic doesn't work on my system
  // keyboard := keylogger.FindKeyboardDevice()
  k, err := keylogger.New("/dev/input/event0")
  if err != nil {
    fmt.Print("Unable to open /dev/input/event0\n")
    return
  }

  termbox.Init()
  host.Init()

  MISO := bcm283x.GPIO10 // purple wire
  CS := bcm283x.GPIO9   // blue wire
  CLK := bcm283x.GPIO11  // brown wire

  MISO.Out(gpio.Low)
  CS.In(gpio.Float, gpio.NoEdge)
  CLK.In(gpio.Float, gpio.NoEdge)

  // Keeps track of how many consecutive times we've hit ESC key
  escape := 5

  // Main loop
  events := k.Read()
  for e := range events {
    if escape == 0 {
      break
    }
    switch e.Type {
      case keylogger.EvKey:
        if e.KeyPress() {
          fmt.Print("pressed " + e.KeyString() + "\n")
          if e.KeyString() == "ESC" {
            escape -= 1
            fmt.Printf("\nPress ESC %d more times to quit\n", escape)
          } else {
            escape = 5
          }
        }
        if e.KeyRelease() {
          fmt.Print("released " + e.KeyString() + "\n")
        }

        // write to SPI
        if e.KeyPress() || e.KeyRelease() {
          WriteKeyEvent(e)
        }

        // weird cleanup step
        if e.KeyRelease() {
          // Consume stdin so it doesn't flow into the terminal
          if e.KeyString() != "" && e.KeyString() != "L_ALT" && e.KeyString() != "R_ALT" &&
             e.KeyString() != "L_SHIFT" && e.KeyString() != "R_SHIFT" &&
             e.KeyString() != "L_CTRL" && e.KeyString() != "R_CTRL" {
            termbox.PollEvent()
          }
        }
        break
    }
  }

  // Teardown
  defer termbox.Close()
}