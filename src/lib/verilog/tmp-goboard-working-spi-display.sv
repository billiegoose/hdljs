
// `include "./design.sv"
`include "./lib/Debouncer.sv"
`include "./lib/DoubleDigitDisplay.sv"
`include "./lib/SSD1306.v"

`include "./lib/NOIZE.sv"
`include "./lib/UART_Encoder.v"

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
  // input i_UART_RX,
  output o_UART_TX,
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
  output io_PMOD_4,
  output io_PMOD_7,
  output io_PMOD_8,
  input io_PMOD_9,
  output io_PMOD_10,
);

  UART_Encoder UART_Encoder (
    .i_Clk(i_Clk),
    .i_Period(20'd217),
    .i_Byte(8'h2A),
    .i_write_enable(1'b1),
    .o_UART_TX(o_UART_TX)
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

  wire [7:0] txByte;
  wire [7:0] rxByte;

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
  wire CS;
  assign io_PMOD_7 = CS;
  wire CS2;
  assign io_PMOD_8 = CS2;
  wire MISO;
  assign io_PMOD_9 = MISO;


  SSD1306 SSD1306 (
    .i_Clk(clock),
    .i_Reset(reset),
    .i_Keyboard_MISO(MISO),
    .o_D0(D0),
    .o_D1(D1),
    .o_RES(RES),
    .o_DC(DC),
    .o_CS(CS),
    .o_CS2(CS2),
    .o_BYTE(txByte),
    .o_Key(rxByte),
    .o_READY()
  );

  DoubleDigitDisplay DoubleDigitDisplay_0 (
    .i_Byte(rxByte),
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

  wire w_AudioOut;
  assign io_PMOD_10 = w_AudioOut;

  NOIZE NOIZE (
    .i_Reset(reset),
    .i_Clk(i_Clk),
    .o_Out(w_AudioOut)
  );
endmodule
