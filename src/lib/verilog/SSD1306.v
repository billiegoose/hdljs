`include "./SPI_ROM.v"
`include "./SPI_RAM.v"
`include "./KEYBOARD_RAM.v"
`include "./spi-master/SPI_Master.v"

module SSD1306 (
  input i_Clk,
  input i_Reset,
  input i_Keyboard_MISO,
  output o_D0,
  output o_D1,
  output o_RES,
  output reg o_DC,
  output reg o_CS,
  output reg o_CS2,
  output [7:0] o_BYTE,
  output reg [7:0] o_Key_Event,
  output [7:0] o_Key,
  output o_READY
);

  /** The STATE MACHINE for the screen looks like this:
   *
   * SCREEN_RESET -> SCREEN_INIT -> FRAME_INIT -> FRAME_STREAM -.
   *       ^-- reset button              ^-.__________________.-'
   */
  parameter s_SCREEN_RESET = 3'b000;
  parameter s_SCREEN_INIT = 3'b001;
  parameter s_FRAME_INIT = 3'b010;
  parameter s_FRAME_STREAM = 3'b011;
  parameter s_KEYBOARD_READ = 3'b100;
  parameter s_KEYBOARD_UPDATE = 3'b101;

  reg [2:0] r_STATE = s_SCREEN_RESET;

  parameter a_SCREEN_INIT_FIRST = 16'd0;
  parameter a_SCREEN_INIT_LAST = 16'd26;
  parameter a_FRAME_INIT_FIRST = 16'd26;
  parameter a_FRAME_INIT_LAST = 16'd32;
  parameter a_FRAME_DATA_FIRST = 16'd0;
  parameter a_FRAME_DATA_LAST = 16'd1024;
  parameter a_KEYBOARD_READ_FIRST = 16'd0; // 16'd6;
  parameter a_KEYBOARD_READ_LAST = 16'd1; // 16'd7;

  reg [15:0] command_address = 16'h0;
  reg [15:0] data_address = 16'h0;
  wire [7:0] w_command_byte;
  wire [7:0] w_data_byte;

  SPI_ROM SPI_ROM (
    .address(command_address),
    .out(w_command_byte)
  );

  SPI_RAM SPI_RAM (
    .w_Data(8'h00),
    .w_Enable(1'b0),
    .w_Address(10'h0),
    .w_Clk(i_Clk),
    .r_Address(data_address[9:0]),
    .r_Clk(i_Clk),
    .r_Data(w_data_byte),
  );

  reg w_Keyboard_Enable;

  KEYBOARD_RAM KEYBOARD_RAM (
    .w_KeyEvent(o_Key_Event),
    .w_Enable(w_Keyboard_Enable),
    .w_Clk(i_Clk),
    .o_Data(o_Key),
  );

  reg [7:0] r_data;

  assign o_RES = ~i_Reset;

  assign o_BYTE = r_data;

  parameter SPI_MODE = 0; // CPOL = 0, CPHA = 0
  parameter CLKS_PER_HALF_BIT = 4; //1;  // 6.25 MHz

  reg r_TX_DV = 1'b0;
  reg [7:0] r_RX_Byte;
  reg r_RX_DV;
  
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
    .o_RX_DV(r_RX_DV),       // Data Valid pulse (1 clock cycle)
    .o_RX_Byte(r_RX_Byte),   // Byte received on MISO

    // SPI Interface
    .o_SPI_Clk(o_D0),
    .o_SPI_MOSI(o_D1),
    .i_SPI_MISO(i_Keyboard_MISO)
  );

  reg r_READY = 1'b0;

  reg [15:0] counter = 16'h0;

  always @(negedge i_Clk) begin
    if (i_Reset) begin
      o_DC <= 1'b0;
      command_address <= 8'b0;
      r_TX_DV <= 1'b0;
      r_STATE <= #1 s_SCREEN_RESET;
      o_CS <= 1'b1;
      o_CS2 <= 1'b1;
      o_Key_Event <= 8'hFF;
    end else begin
      o_Key_Event <= o_Key_Event;
      w_Keyboard_Enable <= 1'b0;
      case (r_STATE)

        s_SCREEN_RESET: begin
          o_CS <= 1'b0;
          o_CS2 <= 1'b1;
          o_DC <= 1'b0;
          counter <= 8'h00;
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
              r_data <= w_command_byte;
              command_address <= #1 command_address + 1;
              r_TX_DV <= 1'b1;
            end
          end else begin
            r_TX_DV <= 1'b0;
          end
        end

        s_FRAME_INIT: begin
          o_DC <= 1'b0;
          o_CS <= 1'b0;
          o_CS2 <= 1'b1;
          if (o_READY == 1'b1) begin
            if (command_address == a_FRAME_INIT_LAST) begin
              r_STATE <= #1 s_FRAME_STREAM;
              data_address <= a_FRAME_DATA_FIRST;
              counter <= counter + 1;
              r_TX_DV <= 1'b0;
            end else begin
              r_data <= w_command_byte;
              command_address <= #1 command_address + 1;
              r_TX_DV <= 1'b1;
            end
          end else begin
            r_TX_DV <= 1'b0;
          end
        end

        s_FRAME_STREAM: begin
          o_DC <= 1'b1;
          o_CS <= 1'b0;
          o_CS2 <= 1'b1;
          if (o_READY == 1'b1) begin
            if (data_address == a_FRAME_DATA_LAST) begin
              r_STATE <= #1 s_KEYBOARD_READ;
              command_address <= #1 a_KEYBOARD_READ_FIRST;
              data_address <= #1 a_FRAME_DATA_FIRST;
              r_TX_DV <= 1'b0;
              o_CS <=  1'b1;
              o_CS2 <= 1'b1;
            end else begin
              r_data <= w_data_byte;
              data_address <= #1 data_address + 1;
              r_TX_DV <= 1'b1;
            end
          end else begin
            r_TX_DV <= 1'b0;
          end
        end

        s_KEYBOARD_READ: begin
          o_DC <= 1'b1;
          o_CS <= 1'b1;
          o_CS2 <= 1'b0;
          if (r_RX_DV == 1'b1) begin
            if (command_address == a_KEYBOARD_READ_LAST) begin
              r_STATE <= #1 s_KEYBOARD_UPDATE;
              command_address <= #1 a_FRAME_INIT_FIRST;
              data_address <= #1 a_FRAME_DATA_FIRST;
              r_TX_DV <= 1'b0;
              // o_CS <= #1 1'b1;
              // o_CS2 <= #1 1'b1;
            end
          end else if (o_READY == 1'b1) begin
            r_data <= w_command_byte;
            command_address <= #1 command_address + 1;
            r_TX_DV <= 1'b1;
          end else begin
            r_TX_DV <= 1'b0;
          end
        end

        s_KEYBOARD_UPDATE: begin
          if (r_RX_Byte != 8'b0) begin
            o_Key_Event <= r_RX_Byte;
            w_Keyboard_Enable <= 1'b1;
          end
          r_STATE <= #1 s_FRAME_INIT;
          command_address <= #1 a_FRAME_INIT_FIRST;
          data_address <= #1 a_FRAME_DATA_FIRST;
          // r_STATE <= #1 s_KEYBOARD_READ;
          // command_address <= #1 a_KEYBOARD_READ_FIRST;
          // data_address <= #1 a_FRAME_DATA_FIRST;
          r_TX_DV <= 1'b0;
          // o_CS <= 1'b1;
          // o_CS2 <= 1'b1;
        end

      endcase
    end
  end
endmodule