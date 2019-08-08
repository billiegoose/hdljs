# A Straightforward Keyboard Event Encoding

The 64 codes encode the commonly used keyboard keys.
The next 64 codes are those same keys with the Shift key held down.
The 8th bit is low for keypress, high for key release.

Ranges 00-2F and 40-6F are printable.
Ranges 30-3F and 70-7F are non-printable control characters.

The printable ranges should be straightforward to implement in
block RAM as two memories behind a Mux with the shift bit (7th bit)
as a selector.

| Code | Char      | Code | Char  |
| ---- | --------- | ---- | ----- |
| 0    | 0         | 40   | )     |
| 1    | 1         | 41   | !     |
| 2    | 2         | 42   | @     |
| 3    | 3         | 43   | #     |
| 4    | 4         | 44   | $     |
| 5    | 5         | 45   | %     |
| 6    | 6         | 46   | ^     |
| 7    | 7         | 47   | &     |
| 8    | 8         | 48   | *     |
| 9    | 9         | 49   | (     |
|------|-----------|------|-------|
| a    | a         | 4a   | A     |
| b    | b         | 4b   | B     |
| c    | c         | 4c   | C     |
| d    | d         | 4d   | D     |
| e    | e         | 4e   | E     |
| f    | f         | 4f   | F     |
| 10   | g         | 50   | G     |
| 11   | h         | 51   | H     |
| 12   | i         | 52   | I     |
| 13   | j         | 53   | J     |
| 14   | k         | 54   | K     |
| 15   | l         | 55   | L     |
| 16   | m         | 56   | M     |
| 17   | n         | 57   | N     |
| 18   | o         | 58   | O     |
| 19   | p         | 59   | P     |
| 1a   | q         | 5a   | Q     |
| 1b   | r         | 5b   | R     |
| 1c   | s         | 5c   | S     |
| 1d   | t         | 5d   | T     |
| 1e   | u         | 5e   | U     |
| 1f   | v         | 5f   | V     |
| 20   | w         | 60   | W     |
| 21   | x         | 61   | X     |
| 22   | y         | 62   | Y     |
| 23   | z         | 63   | Z     |
|------|-----------|------|-------|
| 24   | `         | 64   | ~     |
| 25   | -         | 65   | _     |
| 26   | =         | 66   | +     |
| 27   | [         | 67   | {     |
| 28   | ]         | 68   | }     |
| 29   | \         | 69   | |     |
| 2a   | ;         | 6A   | :     |
| 2b   | '         | 6B   | “     |
| 2c   | ,         | 6C   | <     |
| 2d   | .         | 6D   | >     |
| 2e   | /         | 6E   | ?     |
| 2f   | Space     | 6F   |       |
|------|-----------|------|-------|
| 30   | Tab       | 70   |       |
| 31   | Enter     | 71   |       |
| 32   | Backspace | 72   |       |
| 33   | Up        | 73   |       |
| 34   | Down      | 74   |       |
| 35   | Left      | 75   |       |
| 36   | Right     | 76   |       |
| 37   | Delete    | 77   |       |
| 38   | Home      | 78   |       |
| 39   | End       | 79   |       |
| 3a   | PageUp    | 7A   |       |
| 3b   | PageDown  | 7B   |       |
| 3c   | Alt       | 7C   |       |
| 3d   | Ctrl      | 7D   |       |
| 3e   | Escape    | 7E   |       |
| 3f   | Shift     | 7F   |       |
