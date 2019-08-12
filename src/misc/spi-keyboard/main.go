package main

import (
  "fmt"
  "github.com/MarinX/keylogger"
  "github.com/nsf/termbox-go"
  "periph.io/x/periph/conn/gpio"
  "periph.io/x/periph/host"
  "periph.io/x/periph/host/bcm283x"
)

// https://github.com/MarinX/keylogger/blob/master/keymapper.go
// https://www.usb.org/sites/default/files/documents/hut1_12v2.pdf
var keyCodeMap = map[uint16]uint8 {
  1: 0x29,
  2: 0x1E,
  3: 0x1F,
  4: 0x20,
  5: 0x21,
  6: 0x22,
  7: 0x23,
  8: 0x24,
  9: 0x25,
  10: 0x26,
  11: 0x27,
  12: 0x2D,
  13: 0x2E,
  14: 0x2A,
  15: 0x2B,
  16: 0x14,
  17: 0x1A,
  18: 0x08,
  19: 0x15,
  20: 0x17,
  21: 0x1C,
  22: 0x18,
  23: 0x0C,
  24: 0x12,
  25: 0x13,
  26: 0x2F,
  27: 0x30,
  28: 0x28,
  29: 0xE0,
  30: 0x04,
  31: 0x16,
  32: 0x07,
  33: 0x09,
  34: 0x0A,
  35: 0x0B,
  36: 0x0D,
  37: 0x0E,
  38: 0x0F,
  39: 0x33,
  40: 0x34,
  41: 0x35,
  42: 0xE1,
  43: 0x31,
  44: 0x1D,
  45: 0x1B,
  46: 0x06,
  47: 0x19,
  48: 0x05,
  49: 0x11,
  50: 0x10,
  51: 0x36,
  52: 0x37,
  53: 0x38,
  54: 0xE5,
  55: 0x55,
  56: 0xE2,
  57: 0x2C,
  58: 0x39,
  59: 0x3A,
  60: 0x3B,
  61: 0x3C,
  62: 0x3D,
  63: 0x3E,
  64: 0x3F,
  65: 0x40,
  66: 0x41,
  67: 0x42,
  68: 0x43,
  69: 0x53,
  70: 0x47,
  71: 0x5F,
  72: 0x60,
  73: 0x61,
  74: 0x56,
  75: 0x5C,
  76: 0x5D,
  77: 0x5E,
  78: 0x57,
  79: 0x59,
  80: 0x5A,
  81: 0x5B,
  83: 0x63,
  87: 0x44,
  88: 0x45,
  96: 0x58,
  97: 0xE4,
  98: 0x54,
  99: 0x46,
  100: 0xE6,
  102: 0x4A,
  103: 0x52,
  104: 0x4B,
  105: 0x50,
  106: 0x4F,
  107: 0x4D,
  108: 0x51,
  109: 0x4E,
  110: 0x49,
  111: 0x4C,
  125: 0xE3,
  126: 0xE7,
}

var modifiers uint8 = 0

var modMap = map[uint8]uint8 {
  0xE0: 1 << 0, // L CTRL
  0xE1: 1 << 1, // L SHIFT
  0xE2: 1 << 2, // L ALT
  0xE3: 1 << 3, // L META
  0xE4: 1 << 4, // R CTRL
  0xE5: 1 << 5, // R SHIFT
  0xE6: 1 << 6, // R ALT
  0xE7: 1 << 7, // R META
}

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

  // Update modifier keys
  bitflag, ok := modMap[code]
  if ok && keypress {
    modifiers |= bitflag
  } else if ok && keyrelease {
    modifiers &^= bitflag
  }

  fmt.Printf("mod = %X\n", modifiers)

  var bits [9]gpio.Level
  // send in MSB order
  if keyrelease {
    bits[0] = gpio.High // Key release
  } else {
    bits[0] = gpio.Low // Key press
  }
  bits[1] = (code >> 6) & 1 == 1
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