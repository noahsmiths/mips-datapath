import { ALU } from "./components/ALU";
import { ALUControl } from "./components/ALUControl";
import { And } from "./components/and";
import { BaseAdder } from "./components/baseAdder";
import { Component } from "./components/component";
import { Control } from "./components/control";
import { DataMemory } from "./components/dataMemory";
import { Dumpable } from "./components/dumpable";
import { InstructionMemory } from "./components/instructionMemory";
import { Joiner } from "./components/joiner";
import { LeftShifter } from "./components/leftShifter";
import { Or } from "./components/or";
import { ProgramCounter } from "./components/programCounter";
import { Registers } from "./components/registers";
import { SignExtender } from "./components/signExtender";
import { Splicer } from "./components/splicer";
import { TwoToOneMux } from "./components/twoToOneMux";
import { Wire } from "./components/wire";

const registerFile = new Array(32).fill(0);
// registerFile[7] = 5;
// 
// const instructions = {
//     0x4000: 0x00E02020,
//     0x4004: 0x00842820,
//     0x4008: 0x00A52820
// }

const instructions = {
    0x4000: 0x20070005,
    0x4004: 0x20060007,
    // 0x4008: 0x00C72820,
    0x4008: 0x00C72822
}

export function buildDatapath(pcInitial: number, instructions: { [key: string]: number }) {
    // Wires
    const pcIn = new Wire(32, pcInitial);
    const pcOut = new Wire(32);

    const pcAdderIn = new Wire(32, 4);
    const pcAdderOut = new Wire(32);
    const pcAdderOut31_28 = new Wire(4);

    const imOut = new Wire(32);
    const imOut25_0 = new Wire(26);
    const imOut31_26 = new Wire(6);
    const imOut25_21 = new Wire(5);
    const imOut20_16 = new Wire(5);
    const imOut15_11 = new Wire(5);
    const imOut15_0 = new Wire(16);
    const imOut5_0 = new Wire(6);
    const imOut25_0_left_shift_2 = new Wire(28);
    const imOut15_0_sign_extended = new Wire(32);
    const imOut15_0_sign_extended_left_shift_2 = new Wire(32);

    const jaOut = new Wire(32);

    const controlRegDst = new Wire(1);
    const controlJump = new Wire(1);
    const controlBeq = new Wire(1);
    const controlBne = new Wire(1);
    const controlMemRead = new Wire(1);
    const controlMemToReg = new Wire(1);
    const controlMemWrite = new Wire(1);
    const controlALUSrc = new Wire(1);
    const controlRegWrite = new Wire(1);
    const controlExtType = new Wire(1);

    const writeRegAddress = new Wire(5);
    const writeRegData = new Wire(32);
    const regRead1 = new Wire(32);
    const regRead2 = new Wire(32);

    const aluControlOut = new Wire(4);
    const aluSrcMuxOut = new Wire(32);
    const aluResultOut = new Wire(32);
    const aluZeroOut = new Wire(1);

    const branchAdderOut = new Wire(32);
    const branchBeqAndOut = new Wire(1);
    const branchBneAndOut = new Wire(1);
    const branchBeqOrBneOut = new Wire(1);
    const branchMuxOut = new Wire(32);

    const dataMemoryOut = new Wire(32);

    // Components
    const pc = new ProgramCounter(pcIn, pcOut);

    const pcAdder = new BaseAdder(pcOut, pcAdderIn, pcAdderOut);
    const pcAdderSplicer1 = new Splicer(pcAdderOut, pcAdderOut31_28, 28, 31);

    const im = new InstructionMemory(pcOut, imOut, instructions);
    const imSplicer1 = new Splicer(imOut, imOut25_0, 0, 25);
    const imSplicer2 = new Splicer(imOut, imOut31_26, 26, 31);
    const imSplicer3 = new Splicer(imOut, imOut25_21, 21, 25);
    const imSplicer4 = new Splicer(imOut, imOut20_16, 16, 20);
    const imSplicer5 = new Splicer(imOut, imOut15_11, 11, 15);
    const imSplicer6 = new Splicer(imOut, imOut15_0, 0, 15);
    const imSplicer7 = new Splicer(imOut, imOut5_0, 0, 5);
    const imShifter1 = new LeftShifter(imOut25_0, imOut25_0_left_shift_2, 2);
    const imSignExtender1 = new SignExtender(imOut15_0, imOut15_0_sign_extended, controlExtType, 32);
    const imShifter2 = new LeftShifter(imOut15_0_sign_extended, imOut15_0_sign_extended_left_shift_2, 2);

    const ja = new Joiner(pcAdderOut31_28, imOut25_0_left_shift_2, jaOut);

    const control = new Control(
        imOut31_26,
        imOut5_0,
        controlRegDst,
        controlJump,
        controlBeq,
        controlBne,
        controlMemRead,
        controlMemToReg,
        aluControlOut,
        controlMemWrite,
        controlALUSrc,
        controlRegWrite,
        controlExtType
    );

    const regDstMux = new TwoToOneMux(imOut20_16, imOut15_11, controlRegDst, writeRegAddress);

    const registers = new Registers(
        imOut25_21,
        imOut20_16,
        writeRegAddress,
        writeRegData,
        controlRegWrite,
        regRead1,
        regRead2,
        registerFile
    );

    // const aluControl = new ALUControl(imOut5_0, controlALUOp, aluControlOut);
    const aluSrcMux = new TwoToOneMux(regRead2, imOut15_0_sign_extended, controlALUSrc, aluSrcMuxOut);
    const alu = new ALU(regRead1, aluSrcMuxOut, aluControlOut, aluResultOut, aluZeroOut);

    const branchAdder = new BaseAdder(pcAdderOut, imOut15_0_sign_extended_left_shift_2, branchAdderOut);
    // const branchAnd = new And(controlBranch, aluZeroOut, branchAndOut);
    const beqAnd = new And(controlBeq, aluZeroOut, branchBeqAndOut);
    const bneAnd = new And(controlBne, aluZeroOut, branchBneAndOut, false, true);
    const beqOrBne = new Or(branchBeqAndOut, branchBneAndOut, branchBeqOrBneOut);
    const branchMux = new TwoToOneMux(pcAdderOut, branchAdderOut, branchBeqOrBneOut, branchMuxOut);

    const jumpMux = new TwoToOneMux(branchMuxOut, jaOut, controlJump, pcIn);

    const dataMemory = new DataMemory(aluResultOut, regRead2, controlMemRead, controlMemWrite, dataMemoryOut, {});

    const writebackMux = new TwoToOneMux(aluResultOut, dataMemoryOut, controlMemToReg, writeRegData);

    // Component List
    const componentList: Array<Component> = [
        pc,
        pcAdder,
        pcAdderSplicer1,
        im,
        imSplicer1,
        imSplicer2,
        imSplicer3,
        imSplicer4,
        imSplicer5,
        imSplicer6,
        imSplicer7,
        imShifter1,
        imSignExtender1,
        imShifter2,
        ja,
        control,
        regDstMux,
        registers,
        aluSrcMux,
        alu,
        branchAdder,
        beqAnd,
        bneAnd,
        beqOrBne,
        branchMux,
        jumpMux,
        dataMemory,
        writebackMux,
    ];

    function runCycle() {
        registers.writeValue();

        for (let component of componentList) {
            component.trigger();
        }

        // registers.writeValue(); // Having this here instead of before the loop results in writeback happening before next rising edge
    }

    // Dumpable
    const dumpables: {[key: string]: Dumpable} = {
        // Wires
        pcIn,
        pcOut,
        pcAdderIn,
        pcAdderOut,
        pcAdderOut31_28,
        imOut,
        imOut25_0,
        imOut31_26,
        imOut25_21,
        imOut20_16,
        imOut15_11,
        imOut15_0,
        imOut5_0,
        imOut25_0_left_shift_2,
        imOut15_0_sign_extended,
        imOut15_0_sign_extended_left_shift_2,
        jaOut,
        controlRegDst,
        controlJump,
        controlBeq,
        controlBne,
        controlMemRead,
        controlMemToReg,
        controlMemWrite,
        controlALUSrc,
        controlRegWrite,
        controlExtType,
        writeRegAddress,
        writeRegData,
        regRead1,
        regRead2,
        aluControlOut,
        aluSrcMuxOut,
        aluResultOut,
        aluZeroOut,
        branchAdderOut,
        branchBeqAndOut,
        branchBneAndOut,
        branchBeqOrBneOut,
        branchMuxOut,
        dataMemoryOut,

        // Components:
        pc,
        im,
        registers,
        dataMemory,
    };

    return { dumpables, runCycle };
}

// for (let component of components) {
//     component.trigger();
// }

// registers.writeValue();

// for (let component of components) {
//     component.trigger();
// }

// registers.writeValue();

// for (let component of components) {
//     component.trigger();
// }

// console.log(writeRegData);