// builtin
module NOIZE (
  input i_Reset,
  input i_Clk,
  output o_Out
);
  reg [14:0] sweep = 15'b1;
  reg [15:0] snd_counter = 16'b0;
  reg r_up = 1'b0;
  reg r_Out = 1'b0;
  assign o_Out = r_Out;

  always @(negedge i_Clk) begin
    snd_counter <= snd_counter + 16'b1;
    // 25 000 000 / (2 * 440 Hz) = 28409
    if (snd_counter == sweep) begin
      r_up <= ~r_up;
      snd_counter <= 16'b0;
      sweep <= sweep + 15'b1;
    end
    // let the signal through VOLUME % of the time
    if (snd_counter < 2**8) begin
      r_Out <= r_up;
    end else begin
      r_Out <= 1'b0;
    end
    if (i_Reset) begin
      r_Out <= 1'b0;
      r_up <= 1'b0;
      sweep <= 15'b1;
      snd_counter <= 16'b0;
    end
  end
endmodule
