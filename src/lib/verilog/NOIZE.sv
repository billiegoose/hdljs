// builtin
module NOIZE (
  input i_Reset,
  input i_Clk,
  output o_Out
);
  reg [13:0] sweep = 14'b1;
  reg [15:0] snd_counter = 16'b0;
  reg [15:0] snd_compare = 16'b0;
  reg r_up = 1'b0;
  reg r_Out = 1'b0;
  reg [2:0] volume = 3'd0;
  assign o_Out = r_Out;

  always @(negedge i_Clk) begin
    snd_counter <= snd_counter + 16'b1;
    // 25 000 000 / (2 * 440 Hz) = 28409
    if (snd_counter == sweep) begin
      r_up <= ~r_up;
      snd_counter <= 16'b0;
      sweep <= sweep + 14'b1;
      r_Out <= r_up;
      if (sweep == 0) begin
        volume <= volume + 3'b1;
        // snd_compare <= sweep >> volume;
      end
      case (volume)
       3'd0: snd_compare <= 3'b0;
       3'd1: snd_compare <= sweep >> 6;
       3'd2: snd_compare <= sweep >> 5;
       3'd3: snd_compare <= sweep >> 4;
       3'd4: snd_compare <= sweep >> 3;
       3'd5: snd_compare <= sweep >> 2;
       3'd6: snd_compare <= sweep >> 1;
       3'd7: snd_compare <= sweep;
      endcase
    end
    // let the signal through VOLUME % of the time
    if (snd_counter < snd_compare) begin
      r_Out <= r_up;
    end else begin
      r_Out <= 1'b0;
    end
    if (i_Reset) begin
      r_Out <= 1'b0;
      r_up <= 1'b0;
      sweep <= 14'b1;
      snd_counter <= 16'b0;
    end
  end
endmodule
