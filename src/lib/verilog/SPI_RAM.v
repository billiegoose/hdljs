
// hopefully this will infer correctly
// https://www.latticesemi.com/-/media/LatticeSemi/Documents/ApplicationNotes/MO/MemoryUsageGuideforiCE40Devices.ashx
module SPI_RAM (
  input [7:0] w_Data,
  input w_Enable,
  input [9:0] w_Address,
  input w_Clk,
  input [9:0] r_Address,
  input r_Clk,
  output reg [7:0] r_Data
);
  reg [7:0] mem [0:1023];

  initial begin
    $readmemb("lib/SPI_RAM.bin", mem, 0, 1024);
  end

  // Write memory.
  always @(posedge w_Clk) begin
    if (w_Enable) begin
      mem[w_Address] <= w_Data; // Using write address bus.
    end
  end
  // Read memory.
  always @(posedge r_Clk) begin
    r_Data <= mem[r_Address]; // Using read address bus.
  end
endmodule
