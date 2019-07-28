`include "./SPI_ROM.v"
`include "./spi-master/SPI_Master.v"

module SSD1306 (
  input i_Clk,
  input i_Reset,
  output o_D0,
  output o_D1,
  output o_RES,
  reg output o_DC,
  output [7:0] o_BYTE,
  output o_READY
);
  
  /** The STATE MACHINE for the screen looks like this:
   *
   * SCREEN_RESET -> SCREEN_INIT -> FRAME_INIT -> FRAME_STREAM -.
   *       ^-- reset button              ^-.__________________.-'
   */
  parameter s_SCREEN_RESET = 2'b00;
  parameter s_SCREEN_INIT = 2'b01;
  parameter s_FRAME_INIT = 2'b10;
  parameter s_FRAME_STREAM = 2'b11;

  reg [1:0] r_STATE = s_SCREEN_RESET;

  parameter a_SCREEN_INIT_FIRST = 16'd0;
  parameter a_SCREEN_INIT_LAST = 16'd26;
  parameter a_FRAME_INIT_FIRST = 16'd26;
  parameter a_FRAME_INIT_LAST = 16'd32;
  parameter a_FRAME_DATA_FIRST = 16'd0;
  parameter a_FRAME_DATA_LAST = 16'd1024;

  reg [15:0] command_address = 16'h0;
  reg [15:0] data_address = 16'h0;
  wire [7:0] w_data;

  SPI_ROM SPI_ROM (
    .address(command_address),
    .out(w_data)
  );

  reg [7:0] r_data;

  assign o_RES = ~i_Reset;

  assign o_BYTE = r_data;

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
    .i_TX_Byte(r_data),    // Byte to transmit on MOSI
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

  reg r_READY = 1'b0;

  always @(negedge i_Clk) begin
    if (i_Reset) begin
      o_DC <= 1'b0;
      command_address <= 8'b0;
      r_TX_DV <= 1'b0;
      r_STATE <= #1 s_SCREEN_RESET;
    end else begin
      case (r_STATE)

        s_SCREEN_RESET: begin
          o_DC <= 1'b0;
          r_TX_DV <= 1'b0;
          if (o_READY == 1'b1) begin
            command_address <= a_SCREEN_INIT_FIRST;
            r_STATE <= #1 s_SCREEN_INIT;
          end
        end

        s_SCREEN_INIT: begin
          o_DC <= 1'b0;
          if (o_READY == 1'b1) begin
            if (command_address == a_SCREEN_INIT_LAST) begin
              r_STATE <= #1 s_FRAME_INIT;
              command_address <= #1 a_FRAME_INIT_FIRST;
              r_TX_DV <= 1'b0;
            end else begin
              r_data <= w_data;
              command_address <= #1 command_address + 1;
              r_TX_DV <= 1'b1;
            end
          end else begin
            r_TX_DV <= 1'b0;
          end
        end

        s_FRAME_INIT: begin
          o_DC = 1'b0;
          if (o_READY == 1'b1) begin
            if (command_address == a_FRAME_INIT_LAST) begin
              r_STATE <= #1 s_FRAME_STREAM;
              data_address <= a_FRAME_DATA_FIRST;
              r_TX_DV <= 1'b0;
            end else begin
              r_data <= w_data;
              command_address <= #1 command_address + 1;
              r_TX_DV <= 1'b1;
            end
          end else begin
            r_TX_DV <= 1'b0;
          end
        end

        s_FRAME_STREAM: begin
          o_DC = 1'b1;
          if (o_READY == 1'b1) begin
            if (data_address == a_FRAME_DATA_LAST) begin
              r_STATE <= #1 s_FRAME_INIT;
              command_address <= #1 a_FRAME_INIT_FIRST;
              data_address <= #1 a_FRAME_DATA_FIRST;
              r_TX_DV <= 1'b0;
            end else begin
              r_data <= data_address[9:2];
              data_address <= #1 data_address + 1;
              r_TX_DV <= 1'b1;
            end
          end else begin
            r_TX_DV <= 1'b0;
          end
        end
        
      endcase
    end
  end
endmodule