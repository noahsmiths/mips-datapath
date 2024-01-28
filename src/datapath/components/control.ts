import { numberToBinary } from "../utils/convert";
import { OPCODES } from "../utils/opcodes";
import { Component } from "./component";
import { Wire } from "./wire";

const R_FORMAT_OPCODE = 0b000000;
const I_FORMAT_OPCODE_MASK = 0b001000;
const MEMORY_OPCODE_MASK = 0b100000;

export class Control implements Component {
    constructor(
        private inputWire: Wire,
        private regDstWire: Wire,
        private jumpWire: Wire,
        private branchWire: Wire,
        private memReadWire: Wire,
        private memToRegWire: Wire,
        private ALUOpWire: Wire,
        private memWriteWire: Wire,
        private ALUSrcWire: Wire,
        private regWriteWire: Wire,
    ) {}

    trigger(): void {
        const opcode = this.inputWire.getValue();

        // Must check memory first as a couple memory commands can potentially register as I-formats, too.
        const isMemory = (opcode & MEMORY_OPCODE_MASK) === MEMORY_OPCODE_MASK;
        const isRFormat = opcode === R_FORMAT_OPCODE;
        const isIFormat = (opcode & I_FORMAT_OPCODE_MASK) === I_FORMAT_OPCODE_MASK;
        const isBeq = opcode === OPCODES.BEQ;
        const isJump = opcode === OPCODES.J;

        if (isMemory) {
            this.regDstWire.setLow();
            this.jumpWire.setLow();
            this.branchWire.setLow();
            this.ALUOpWire.setValue(0b00);
            this.ALUSrcWire.setHigh();

            switch (opcode) {
                case OPCODES.SW:
                    this.memReadWire.setLow();
                    this.memToRegWire.setLow();
                    this.memWriteWire.setHigh();
                    this.regWriteWire.setLow();
                    break;
                case OPCODES.LW:
                    this.memReadWire.setHigh();
                    this.memToRegWire.setHigh();
                    this.memWriteWire.setLow();
                    this.regWriteWire.setHigh();
                    break;
                default:
                    throw new Error(`Opcode ${numberToBinary(opcode)} is not valid.`);
            }
        } else if (isRFormat) {
            this.regDstWire.setHigh();
            this.jumpWire.setLow();
            this.branchWire.setLow();
            this.memReadWire.setLow();
            this.memToRegWire.setLow();
            this.ALUOpWire.setValue(0b10);
            this.memWriteWire.setLow();
            this.ALUSrcWire.setLow();
            this.regWriteWire.setHigh();
        } else if (isIFormat) {
            throw new Error("TODO: Implement AluOP's for I-Format instructions. No funct field exists with I-format, so it must be set through the AluOP");

            this.regDstWire.setHigh();
            this.jumpWire.setLow();
            this.branchWire.setLow();
            this.memReadWire.setLow();
            this.memToRegWire.setLow();
            this.ALUOpWire.setValue(0b10);
            this.memWriteWire.setLow();
            this.ALUSrcWire.setHigh();
            this.regWriteWire.setHigh();
        } else if (isBeq) {
            this.jumpWire.setLow();
            this.branchWire.setHigh();
            this.memReadWire.setLow();
            this.ALUOpWire.setValue(0b01);
            this.memWriteWire.setLow();
            this.ALUSrcWire.setLow();
            this.regWriteWire.setLow();
        } else if (isJump) {
            this.jumpWire.setHigh();
            this.branchWire.setLow();
            this.memReadWire.setLow();
            this.memWriteWire.setLow();
            this.regWriteWire.setLow();
        } else {
            throw new Error(`Opcode ${numberToBinary(opcode)} is not valid.`);
        }
    }

}