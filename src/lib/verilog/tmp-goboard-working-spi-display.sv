
// `include "./design.sv"
`include "./lib/Debouncer.sv"
`include "./lib/DoubleDigitDisplay.sv"
`include "./lib/SSD1306.v"

module Go_Board (
  input  i_Clk,
  input  i_Switch_1,
  input  i_Switch_2,
  input  i_Switch_3,
  // input  i_Switch_4,
  output o_LED_1,
  output o_LED_2,
  output o_LED_3,
  output o_LED_4,
  output o_Segment1_A,
  output o_Segment1_B,
  output o_Segment1_C,
  output o_Segment1_D,
  output o_Segment1_E,
  output o_Segment1_F,
  output o_Segment1_G,
  output o_Segment2_A,
  output o_Segment2_B,
  output o_Segment2_C,
  output o_Segment2_D,
  output o_Segment2_E,
  output o_Segment2_F,
  output o_Segment2_G,
  output io_PMOD_1,
  output io_PMOD_2,
  output io_PMOD_3,
  output io_PMOD_4
  // inout io_PMOD_7,
  // inout io_PMOD_8,
  // inout io_PMOD_9,
  // inout io_PMOD_10
);

  wire w_Switch_1;
  Debouncer Debouncer_1 (
    .clock(i_Clk),
    .in_0(i_Switch_1),
    .out_0(w_Switch_1)
  );

  wire w_Switch_3;
  Debouncer Debouncer_3 (
    .clock(i_Clk),
    .in_0(i_Switch_3),
    .out_0(w_Switch_3)
  );

  reg clock = 0;
  wire reset = i_Switch_2;

  wire [15:0] txByte;

  reg [31:0] Clk_Cnt = 32'b0;

  parameter CLOCK_REDUCTION = 2**1;

  always @(posedge i_Clk) begin
    Clk_Cnt <= (Clk_Cnt + 1) % CLOCK_REDUCTION;
    if (Clk_Cnt == 32'b0) begin
      clock = ~clock;
    end
  end

  wire D0;
  assign io_PMOD_1 = D0;
  assign o_LED_1 = D0;
  wire D1;
  assign io_PMOD_2 = D1;
  assign o_LED_2 = D1;
  wire RES;
  assign io_PMOD_3 = RES;
  assign o_LED_3 = RES;
  wire DC;
  assign io_PMOD_4 = DC;
  assign o_LED_4 = DC;


  SSD1306 SSD1306 (
    .i_Clk(clock),
    .i_Reset(reset),
    .o_D0(D0),
    .o_D1(D1),
    .o_RES(RES),
    .o_DC(DC),
    .o_BYTE(txByte),
    .o_READY()
  );

  // reg [15:0] address = 8'h0;
  // wire [7:0] txByte;

  // SPI_ROM SPI_ROM (
  //   .address(address),
  //   .out(txByte)
  // );

  // parameter SPI_MODE = 0; // CPOL = 0, CPHA = 0
  // parameter CLKS_PER_HALF_BIT = 1;  // 6.25 MHz

  // reg [7:0] r_Master_TX_Byte = 8'hFF;
  // reg r_TX_DV = 1'b0;
  // // logic [7:0] r_Master_RX_Byte;

  // // Instantiate UUT
  // SPI_Master #(.SPI_MODE(SPI_MODE), .CLKS_PER_HALF_BIT(CLKS_PER_HALF_BIT))
  // SPI_Master_UUT
  // (
  //   // Control/Data Signals,
  //   .i_Rst_L(~reset),     // FPGA Reset
  //   .i_Clk(clock),         // FPGA Clock

  //   // TX (MOSI) Signals
  //   //  .i_TX_Byte(r_Master_TX_Byte),  // Byte to transmit on MOSI
  //   .i_TX_Byte(txByte),  // Byte to transmit on MOSI
  //   .i_TX_DV(r_TX_DV),          // Data Valid Pulse with i_TX_Byte
  //   .o_TX_Ready(o_LED_1),          // Transmit Ready for Byte

  //   // RX (MISO) Signals
  //   //  .o_RX_DV(r_Master_RX_DV),       // Data Valid pulse (1 clock cycle)
  //   //  .o_RX_Byte(r_Master_RX_Byte),   // Byte received on MISO

  //   // SPI Interface
  //   .o_SPI_MOSI(o_LED_2),
  //   .i_SPI_MISO(1'b0),
  //   .o_SPI_Clk(o_LED_4)
  // );

  // reg r_TX_DV_delayed = 1'b0;

  // always @(negedge clock) begin
  //   if (i_Switch_2) begin
  //     address <= 0;
  //     r_TX_DV <= 1'b0;
  //   end else begin
  //     if (o_LED_1 == 1'b1) begin
  //       r_TX_DV <= 1'b1;
  //     end else begin
  //       r_TX_DV <= 1'b0;
  //     end
  //     r_TX_DV_delayed <= r_TX_DV;
  //     if (r_TX_DV_delayed == 1'b1) begin
  //       address <= address + 1;
  //     end
  //   end
  // end

  DoubleDigitDisplay DoubleDigitDisplay_0 (
    .i_Byte(txByte),
    .o_Segment1_A(o_Segment1_A),
    .o_Segment1_B(o_Segment1_B),
    .o_Segment1_C(o_Segment1_C),
    .o_Segment1_D(o_Segment1_D),
    .o_Segment1_E(o_Segment1_E),
    .o_Segment1_F(o_Segment1_F),
    .o_Segment1_G(o_Segment1_G),
    .o_Segment2_A(o_Segment2_A),
    .o_Segment2_B(o_Segment2_B),
    .o_Segment2_C(o_Segment2_C),
    .o_Segment2_D(o_Segment2_D),
    .o_Segment2_E(o_Segment2_E),
    .o_Segment2_F(o_Segment2_F),
    .o_Segment2_G(o_Segment2_G)
  );
endmodule
