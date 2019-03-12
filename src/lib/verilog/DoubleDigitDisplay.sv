module DoubleDigitDisplay (
  input [0:7] i_Byte,
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
  output o_Segment2_G
  );
  
  SingleDigitDisplay SingleDigitDisplay_1 (
    .i_Nibble(i_Byte[0:3]),
    .o_Segment_A(o_Segment1_A),
    .o_Segment_B(o_Segment1_B),
    .o_Segment_C(o_Segment1_C),
    .o_Segment_D(o_Segment1_D),
    .o_Segment_E(o_Segment1_E),
    .o_Segment_F(o_Segment1_F),
    .o_Segment_G(o_Segment1_G)
    );
  SingleDigitDisplay SingleDigitDisplay_2 (
    .i_Nibble(i_Byte[4:7]),
    .o_Segment_A(o_Segment2_A),
    .o_Segment_B(o_Segment2_B),
    .o_Segment_C(o_Segment2_C),
    .o_Segment_D(o_Segment2_D),
    .o_Segment_E(o_Segment2_E),
    .o_Segment_F(o_Segment2_F),
    .o_Segment_G(o_Segment2_G)
    );
    
endmodule

module SingleDigitDisplay (
  input [0:3] i_Nibble,
  output o_Segment_A,
  output o_Segment_B,
  output o_Segment_C,
  output o_Segment_D,
  output o_Segment_E,
  output o_Segment_F,
  output o_Segment_G
  );
  
  reg [6:0] w_Display;
  
  always @(i_Nibble)
    case (i_Nibble)
      0: w_Display = 7'h81;
      1: w_Display = 7'hCF;
      2: w_Display = 7'h92;
      3: w_Display = 7'h86;
      4: w_Display = 7'hCC;
      5: w_Display = 7'hA4;
      6: w_Display = 7'hA0;
      7: w_Display = 7'h8F;
      8: w_Display = 7'h80;
      9: w_Display = 7'h84;
      10: w_Display = 7'h88;
      11: w_Display = 7'hE0;
      12: w_Display = 7'hB1;
      13: w_Display = 7'hC2;
      14: w_Display = 7'hB0;
      15: w_Display = 7'hB8;
    endcase
    
  assign o_Segment_A = w_Display[6];
  assign o_Segment_B = w_Display[5];
  assign o_Segment_C = w_Display[4];
  assign o_Segment_D = w_Display[3];
  assign o_Segment_E = w_Display[2];
  assign o_Segment_F = w_Display[1];
  assign o_Segment_G = w_Display[0];
  
endmodule
