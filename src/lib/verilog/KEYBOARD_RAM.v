module KEYBOARD_RAM (
  input w_KeyEvent,
  input w_Enable,
  input w_Clk,
  output reg [7:0] o_Data = 8'b0,
);
  reg shift = 1'b0;

  // Write memory.
  always @(posedge w_Clk) begin
    if (w_Enable) begin
      // Shift (0x70 and 0x71)
      if (w_KeyEvent[6:1] == 6'h38) begin
        shift <= w_KeyEvent[7];
      end
      if (w_KeyEvent[7]) begin
        o_Data <= {0, w_KeyEvent[6:0]};
      end else begin
        o_Data <= 8'h00;
      end
    end
  end

endmodule
