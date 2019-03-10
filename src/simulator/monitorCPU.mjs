function get16bitnum (object, name) {
  return (
    object[`${name}_0`] +
    object[`${name}_1`] * 2 +
    object[`${name}_2`] * 4 +
    object[`${name}_3`] * 8 +
    object[`${name}_4`] * 16 +
    object[`${name}_5`] * 32 +
    object[`${name}_6`] * 64 +
    object[`${name}_7`] * 128 +
    object[`${name}_8`] * 256 +
    object[`${name}_9`] * 512 +
    object[`${name}_10`] * 1024 +
    object[`${name}_11`] * 2048 +
    object[`${name}_12`] * 4096 +
    object[`${name}_13`] * 8192 +
    object[`${name}_14`] * 16384
  );
}

export function monitorCPU (computer) {
  const instruction = document.getElementById('instruction');
  const a = document.getElementById('a-reg');
  const d = document.getElementById('d-reg');
  const inM = document.getElementById('m-in');
  const outM = document.getElementById('m-out');
  const addressM = document.getElementById('m-addr');
  const pc = document.getElementById('pc');
  const updateScreen = () => {
    requestAnimationFrame(updateScreen);
    instruction.textContent = get16bitnum(computer, 'instruction');
    a.textContent = get16bitnum(computer.CPU_0, 'A');
    d.textContent = get16bitnum(computer.CPU_0, 'D');
    inM.textContent = get16bitnum(computer.CPU_0, 'inM');
    outM.textContent = get16bitnum(computer.CPU_0, 'outM');
    addressM.textContent = get16bitnum(computer.CPU_0, 'addressM');
    pc.textContent = get16bitnum(computer, 'pc');
  }
  requestAnimationFrame(updateScreen);
//   chip.addBuiltin('js', `
// function CPU () {
//   let i_0, address_0, address_1, address_2, address_3, address_4, address_5, address_6, address_7, address_8, address_9, address_10, address_11, address_12, address_13, address_14, a_0, c_0, c_1, c_2, c_3, c_4, c_5, d_0, d_1, d_2, j_0, j_1, j_2, A_0, A_1, A_2, A_3, A_4, A_5, A_6, A_7, A_8, A_9, A_10, A_11, A_12, A_13, A_14, A_15, AM_0, AM_1, AM_2, AM_3, AM_4, AM_5, AM_6, AM_7, AM_8, AM_9, AM_10, AM_11, AM_12, AM_13, AM_14, AM_15, D_0, D_1, D_2, D_3, D_4, D_5, D_6, D_7, D_8, D_9, D_10, D_11, D_12, D_13, D_14, D_15, comp_0, comp_1, comp_2, comp_3, comp_4, comp_5, comp_6, comp_7, comp_8, comp_9, comp_10, comp_11, comp_12, comp_13, comp_14, comp_15, zr_0, ng_0, ni_0, loadA_0, Ain_0, Ain_1, Ain_2, Ain_3, Ain_4, Ain_5, Ain_6, Ain_7, Ain_8, Ain_9, Ain_10, Ain_11, Ain_12, Ain_13, Ain_14, Ain_15, loadD_0, ps_0, j1_0, j2_0, j3_0, jx_0, jy_0, jump_0, njump_0, outM_0, outM_1, outM_2, outM_3, outM_4, outM_5, outM_6, outM_7, outM_8, outM_9, outM_10, outM_11, outM_12, outM_13, outM_14, outM_15, writeM_0, addressM_0, addressM_1, addressM_2, addressM_3, addressM_4, addressM_5, addressM_6, addressM_7, addressM_8, addressM_9, addressM_10, addressM_11, addressM_12, addressM_13, addressM_14, pc_0, pc_1, pc_2, pc_3, pc_4, pc_5, pc_6, pc_7, pc_8, pc_9, pc_10, pc_11, pc_12, pc_13, pc_14;
//   let Copy_0 = Copy();
//   let Copy16_1 = Copy16();
//   let Copy_2 = Copy();
//   let Copy16_3 = Copy16();
//   let Copy16_4 = Copy16();
//   let Copy16_5 = Copy16();
//   let Mux16_6 = Mux16();
//   let ALU_7 = ALU();
//   let And_8 = And();
//   let Copy16_9 = Copy16();
//   let Copy16_10 = Copy16();
//   let Not_11 = Not();
//   let Or_12 = Or();
//   let Mux16_13 = Mux16();
//   let And_14 = And();
//   let Nor_15 = Nor();
//   let And_16 = And();
//   let And_17 = And();
//   let And_18 = And();
//   let Or_19 = Or();
//   let Or_20 = Or();
//   let And_21 = And();
//   let Not_22 = Not();
//   let Register_23 = Register();
//   let Register_24 = Register();
//   let PC_25 = PC();
//   return function CPU (inM_0, inM_1, inM_2, inM_3, inM_4, inM_5, inM_6, inM_7, inM_8, inM_9, inM_10, inM_11, inM_12, inM_13, inM_14, inM_15, instruction_0, instruction_1, instruction_2, instruction_3, instruction_4, instruction_5, instruction_6, instruction_7, instruction_8, instruction_9, instruction_10, instruction_11, instruction_12, instruction_13, instruction_14, instruction_15, reset_0) {
//     console.log(inM_0);
//     if (inM_0 === undefined) return [outM_0, outM_1, outM_2, outM_3, outM_4, outM_5, outM_6, outM_7, outM_8, outM_9, outM_10, outM_11, outM_12, outM_13, outM_14, outM_15, writeM_0, addressM_0, addressM_1, addressM_2, addressM_3, addressM_4, addressM_5, addressM_6, addressM_7, addressM_8, addressM_9, addressM_10, addressM_11, addressM_12, addressM_13, addressM_14, pc_0, pc_1, pc_2, pc_3, pc_4, pc_5, pc_6, pc_7, pc_8, pc_9, pc_10, pc_11, pc_12, pc_13, pc_14];
//     ;[A_0, A_1, A_2, A_3, A_4, A_5, A_6, A_7, A_8, A_9, A_10, A_11, A_12, A_13, A_14, A_15] = Register_23();
//     ;[D_0, D_1, D_2, D_3, D_4, D_5, D_6, D_7, D_8, D_9, D_10, D_11, D_12, D_13, D_14, D_15] = Register_24();
//     ;[pc_0, pc_1, pc_2, pc_3, pc_4, pc_5, pc_6, pc_7, pc_8, pc_9, pc_10, pc_11, pc_12, pc_13, pc_14] = PC_25();
//     ;[i_0] = Copy_0(instruction_15);
//     ;[address_0, address_1, address_2, address_3, address_4, address_5, address_6, address_7, address_8, address_9, address_10, address_11, address_12, address_13, address_14, ] = Copy16_1(instruction_0, instruction_1, instruction_2, instruction_3, instruction_4, instruction_5, instruction_6, instruction_7, instruction_8, instruction_9, instruction_10, instruction_11, instruction_12, instruction_13, instruction_14, 0);
//     ;[a_0] = Copy_2(instruction_12);
//     ;[c_0, c_1, c_2, c_3, c_4, c_5, , , , , , , , , , ] = Copy16_3(instruction_6, instruction_7, instruction_8, instruction_9, instruction_10, instruction_11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
//     ;[d_0, d_1, d_2, , , , , , , , , , , , , ] = Copy16_4(instruction_3, instruction_4, instruction_5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
//     ;[j_0, j_1, j_2, , , , , , , , , , , , , ] = Copy16_5(instruction_0, instruction_1, instruction_2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
//     ;[AM_0, AM_1, AM_2, AM_3, AM_4, AM_5, AM_6, AM_7, AM_8, AM_9, AM_10, AM_11, AM_12, AM_13, AM_14, AM_15] = Mux16_6(a_0, A_0, A_1, A_2, A_3, A_4, A_5, A_6, A_7, A_8, A_9, A_10, A_11, A_12, A_13, A_14, A_15, inM_0, inM_1, inM_2, inM_3, inM_4, inM_5, inM_6, inM_7, inM_8, inM_9, inM_10, inM_11, inM_12, inM_13, inM_14, inM_15);
//     ;[comp_0, comp_1, comp_2, comp_3, comp_4, comp_5, comp_6, comp_7, comp_8, comp_9, comp_10, comp_11, comp_12, comp_13, comp_14, comp_15, zr_0, ng_0] = ALU_7(c_5, c_4, c_3, c_2, c_1, c_0, D_0, D_1, D_2, D_3, D_4, D_5, D_6, D_7, D_8, D_9, D_10, D_11, D_12, D_13, D_14, D_15, AM_0, AM_1, AM_2, AM_3, AM_4, AM_5, AM_6, AM_7, AM_8, AM_9, AM_10, AM_11, AM_12, AM_13, AM_14, AM_15);
//     ;[writeM_0] = And_8(i_0, d_0);
//     ;[addressM_0, addressM_1, addressM_2, addressM_3, addressM_4, addressM_5, addressM_6, addressM_7, addressM_8, addressM_9, addressM_10, addressM_11, addressM_12, addressM_13, addressM_14, ] = Copy16_9(A_0, A_1, A_2, A_3, A_4, A_5, A_6, A_7, A_8, A_9, A_10, A_11, A_12, A_13, A_14, A_15);
//     ;[outM_0, outM_1, outM_2, outM_3, outM_4, outM_5, outM_6, outM_7, outM_8, outM_9, outM_10, outM_11, outM_12, outM_13, outM_14, outM_15] = Copy16_10(comp_0, comp_1, comp_2, comp_3, comp_4, comp_5, comp_6, comp_7, comp_8, comp_9, comp_10, comp_11, comp_12, comp_13, comp_14, comp_15);
//     ;[ni_0] = Not_11(i_0);
//     ;[loadA_0] = Or_12(ni_0, d_2);
//     ;[Ain_0, Ain_1, Ain_2, Ain_3, Ain_4, Ain_5, Ain_6, Ain_7, Ain_8, Ain_9, Ain_10, Ain_11, Ain_12, Ain_13, Ain_14, Ain_15] = Mux16_13(i_0, instruction_0, instruction_1, instruction_2, instruction_3, instruction_4, instruction_5, instruction_6, instruction_7, instruction_8, instruction_9, instruction_10, instruction_11, instruction_12, instruction_13, instruction_14, instruction_15, comp_0, comp_1, comp_2, comp_3, comp_4, comp_5, comp_6, comp_7, comp_8, comp_9, comp_10, comp_11, comp_12, comp_13, comp_14, comp_15);
//     ;[loadD_0] = And_14(i_0, d_1);
//     ;[ps_0] = Nor_15(ng_0, zr_0);
//     ;[j1_0] = And_16(j_2, ng_0);
//     ;[j2_0] = And_17(j_1, zr_0);
//     ;[j3_0] = And_18(j_0, ps_0);
//     ;[jx_0] = Or_19(j1_0, j2_0);
//     ;[jy_0] = Or_20(jx_0, j3_0);
//     ;[jump_0] = And_21(i_0, jy_0);
//     ;[njump_0] = Not_22(jump_0);    // yeah debugging
//     global.A =
//       A_0 +
//       A_1 * 2 +
//       A_2 * 4 +
//       A_3 * 8 +
//       A_4 * 16 +
//       A_5 * 32 +
//       A_6 * 64 +
//       A_7 * 128 +
//       A_8 * 256 +
//       A_9 * 512 +
//       A_10 * 1024 +
//       A_11 * 2048 +
//       A_12 * 4096 +
//       A_13 * 8192 +
//       A_14 * 16384 +
//       A_15 * 32768;
//     global.PC =
//       pc_0 +
//       pc_1 * 2 +
//       pc_2 * 4 +
//       pc_3 * 8 +
//       pc_4 * 16 +
//       pc_5 * 32 +
//       pc_6 * 64 +
//       pc_7 * 128 +
//       pc_8 * 256 +
//       pc_9 * 512 +
//       pc_10 * 1024 +
//       pc_11 * 2048 +
//       pc_12 * 4096 +
//       pc_13 * 8192 +
//       pc_14 * 16384;
//     console.log(jump_0, njump_0, reset_0, A_0, A_1, A_2, A_3, A_4, A_5, A_6, A_7, A_8, A_9, A_10, A_11, A_12, A_13, A_14, A_15);
//     // end debugging
//     ;[A_0, A_1, A_2, A_3, A_4, A_5, A_6, A_7, A_8, A_9, A_10, A_11, A_12, A_13, A_14, A_15] = Register_23(Ain_0, Ain_1, Ain_2, Ain_3, Ain_4, Ain_5, Ain_6, Ain_7, Ain_8, Ain_9, Ain_10, Ain_11, Ain_12, Ain_13, Ain_14, Ain_15, loadA_0);
//     ;[D_0, D_1, D_2, D_3, D_4, D_5, D_6, D_7, D_8, D_9, D_10, D_11, D_12, D_13, D_14, D_15] = Register_24(comp_0, comp_1, comp_2, comp_3, comp_4, comp_5, comp_6, comp_7, comp_8, comp_9, comp_10, comp_11, comp_12, comp_13, comp_14, comp_15, loadD_0);
//     ;[pc_0, pc_1, pc_2, pc_3, pc_4, pc_5, pc_6, pc_7, pc_8, pc_9, pc_10, pc_11, pc_12, pc_13, pc_14, ] = PC_25(jump_0, njump_0, reset_0, A_0, A_1, A_2, A_3, A_4, A_5, A_6, A_7, A_8, A_9, A_10, A_11, A_12, A_13, A_14, A_15);
//     return [outM_0, outM_1, outM_2, outM_3, outM_4, outM_5, outM_6, outM_7, outM_8, outM_9, outM_10, outM_11, outM_12, outM_13, outM_14, outM_15, writeM_0, addressM_0, addressM_1, addressM_2, addressM_3, addressM_4, addressM_5, addressM_6, addressM_7, addressM_8, addressM_9, addressM_10, addressM_11, addressM_12, addressM_13, addressM_14, pc_0, pc_1, pc_2, pc_3, pc_4, pc_5, pc_6, pc_7, pc_8, pc_9, pc_10, pc_11, pc_12, pc_13, pc_14];
//   }
// }`);
}

