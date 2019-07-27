`include "./SPI_ROM.v"
`include "./spi-master/SPI_Master.v"

module SSD1306 (
  input i_Clk,
  input i_Reset,
  output o_D0,
  output o_D1,
  output o_RES,
  output o_DC,
  output [7:0] o_BYTE,
  output o_READY
);
  reg [15:0] address = 16'h0;
  wire [7:0] txByte;

  SPI_ROM SPI_ROM (
    .address(address),
    .out(txByte)
  );

  assign o_BYTE = txByte;

  parameter SPI_MODE = 0; // CPOL = 0, CPHA = 0
  parameter CLKS_PER_HALF_BIT = 1;  // 6.25 MHz

  reg r_TX_DV = 1'b0;
  // logic [7:0] r_Master_RX_Byte;

  // Instantiate UUT
  SPI_Master #(.SPI_MODE(SPI_MODE), .CLKS_PER_HALF_BIT(CLKS_PER_HALF_BIT))
  SPI_Master_UUT
  (
    // Control/Data Signals,
    .i_Rst_L(~i_Reset),    // FPGA Reset
    .i_Clk(i_Clk),         // FPGA Clock

    // TX (MOSI) Signals
    .i_TX_Byte(txByte),    // Byte to transmit on MOSI
    .i_TX_DV(r_TX_DV),     // Data Valid Pulse with i_TX_Byte
    .o_TX_Ready(o_READY),  // Transmit Ready for Byte

    // RX (MISO) Signals
    //  .o_RX_DV(r_Master_RX_DV),       // Data Valid pulse (1 clock cycle)
    //  .o_RX_Byte(r_Master_RX_Byte),   // Byte received on MISO

    // SPI Interface
    .o_SPI_Clk(o_D0),
    .o_SPI_MOSI(o_D1),
    .i_SPI_MISO(1'b0)
  );

  reg r_TX_DV_delayed = 1'b0;

  always @(negedge i_Clk) begin
    if (i_Reset) begin
      address <= 0;
      r_TX_DV <= 1'b0;
    end else begin
      if (o_READY == 1'b1) begin
        r_TX_DV <= 1'b1;
      end else begin
        r_TX_DV <= 1'b0;
      end
      r_TX_DV_delayed <= r_TX_DV;
      if (r_TX_DV_delayed == 1'b1) begin
        address <= address + 1;
      end
    end
  end
endmodule