module Debouncer (
  input clock,
  input in_0,
  output out_0
  );
  
  parameter DEBOUNCE_LIMIT = 250000;
  
  reg r_State = 1'b0;
  reg [17:0] r_Count = 0;
  
  
  always @(posedge clock) begin
    if (in_0 !== r_State && r_Count < DEBOUNCE_LIMIT)
      r_Count <= r_Count + 1;
    else if (r_Count == DEBOUNCE_LIMIT) begin
      r_Count <= 0;
      r_State <= in_0;
    end else
      r_Count <= 0;
  end
  
  assign out_0 = r_State;
  
endmodule