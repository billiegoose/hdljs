module KEYBOARD_RAM (
  input [7:0] w_KeyEvent,
  input w_Enable,
  input w_Clk,
  output [7:0] o_Data,
);
  reg shift = 1'b0;
  reg [7:0] mem = 8'b0;

  assign o_Data = mem;

  wire [7:0] w_KeyCode = {1'b0, w_KeyEvent[6:0]};
  wire w_KeyUp = w_KeyEvent[7];

  // Write memory.
  always @(posedge w_Clk) begin
    if (w_Enable) begin
      // Shift (0x72 and 0x73)
      if (w_KeyCode == 8'h72 || w_KeyCode == 8'h73) begin
        shift <= ~w_KeyUp;
      end else begin
        shift <= shift;
      end
      if (w_KeyUp == 1'b1) begin
        mem <= 8'h00;
      end else begin
        // A-Z and a-z
        if (w_KeyCode > 8'h03 && w_KeyCode < 8'h1E) begin
          if (shift == 1'b1) begin
            mem <= 8'h3D + w_KeyCode;
          end else begin
            mem <= 8'h5D + w_KeyCode;
          end
        end
        // 1-9
        if (w_KeyCode > 8'h1D && w_KeyCode < 8'h27) begin
          if (shift == 1'b1) begin
          end else begin
            mem <= 8'h13 + w_KeyCode;
          end
        end
        // 0
        if (w_KeyCode == 8'h27) begin
          if (shift == 1'b1) begin
            mem <= 8'h29;
          end else begin
            mem <= 8'h30;
          end
        end
      end
    end
  end

endmodule
