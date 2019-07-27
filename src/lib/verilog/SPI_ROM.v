
// builtin
module SPI_ROM (
  input  [15:0] address,
  output [7:0] out,
);
  // http://www.asic-world.com/verilog/memory_fsm1.html
  reg [7:0] my_memory [0:100]; // full 32K will be [0:32768]
  initial begin
    $readmemh("lib/SPI_ROM.hex", my_memory, 0, 100);
  end
  wire [7:0] word = my_memory[address];
  assign out = word;
endmodule
