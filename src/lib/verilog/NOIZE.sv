// builtin
module NOIZE (
  input i_Clk,
  output o_Out
);
  reg [13:0] sweep = 14'b1;
  reg [15:0] snd_counter = 16'b0;
  reg r_Out = 1'b0;
  assign o_Out = r_Out;

  always @(negedge i_Clk) begin
    snd_counter <= snd_counter + 16'b1;
    // 25 000 000 / (2 * 440 Hz)
    if (snd_counter == sweep) begin
      r_Out <= ~r_Out;
      snd_counter <= 16'b0;
      sweep <= sweep + 14'b1;
    end
  end
endmodule
