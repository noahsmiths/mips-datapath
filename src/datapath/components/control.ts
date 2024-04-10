import { numberToBinary } from "../utils/convert";
import { ALU_FUNCT_CODES } from "../utils/functCodes";
import { FUNCTION_BITFIELD } from "../utils/instructionBitfields";
import { OPCODES } from "../utils/opcodes";
import { Component } from "./component";
import { Wire } from "./wire";

const R_FORMAT_OPCODE = 0b000000;
const I_FORMAT_OPCODE_MASK = 0b001000;
const MEMORY_OPCODE_MASK = 0b100000;

export class Control implements Component {
    constructor(
        private inputWire: Wire,
        private functionWire: Wire,
        private regDstWire: Wire,
        private jumpWire: Wire,
        private branchEqualWire: Wire,
        private branchNotEqualWire: Wire,
        private memReadWire: Wire,
        private memToRegWire: Wire,
        private ALUOpWire: Wire,
        private memWriteWire: Wire,
        private ALUSrcWire: Wire,
        private regWriteWire: Wire,
        private extTypeWire: Wire,
    ) {}

    trigger(): void {
        const opcode = this.inputWire.getValue();
        const functionField = this.functionWire.getValue();

        // Must check memory first as a couple memory commands can potentially register as I-formats, too.
        const isMemory = (opcode & MEMORY_OPCODE_MASK) === MEMORY_OPCODE_MASK;
        const isRFormat = opcode === R_FORMAT_OPCODE;
        const isIFormat = (opcode & I_FORMAT_OPCODE_MASK) === I_FORMAT_OPCODE_MASK;
        const isBeq = opcode === OPCODES.BEQ;
        const isBne = opcode === OPCODES.BNE;
        const isJump = opcode === OPCODES.J;

        if (isMemory) {
            this.regDstWire.setLow();
            this.jumpWire.setLow();
            // this.branchWire.setLow();
            this.branchEqualWire.setLow();
            this.branchNotEqualWire.setLow();
            this.ALUOpWire.setValue(ALU_FUNCT_CODES.AND);
            this.ALUSrcWire.setHigh();
            this.extTypeWire.setLow();

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
                    throw new Error(`Opcode ${numberToBinary(opcode, 6)} is not valid.`);
            }
        } else if (isRFormat) {
            this.regDstWire.setHigh();
            this.jumpWire.setLow();
            this.branchEqualWire.setLow();
            this.branchNotEqualWire.setLow();
            this.memReadWire.setLow();
            this.memToRegWire.setLow();
            // this.ALUOpWire.setValue(0b10);
            this.memWriteWire.setLow();
            this.ALUSrcWire.setLow();
            this.regWriteWire.setHigh();
            this.extTypeWire.setLow();

            switch (functionField) {
                case FUNCTION_BITFIELD.AND:
                    this.ALUOpWire.setValue(ALU_FUNCT_CODES.ADD);
                    break;
                case FUNCTION_BITFIELD.OR:
                    this.ALUOpWire.setValue(ALU_FUNCT_CODES.OR);
                    break;
                case FUNCTION_BITFIELD.ADD:
                    this.ALUOpWire.setValue(ALU_FUNCT_CODES.ADD);
                    break;
                case FUNCTION_BITFIELD.SUB:
                    this.ALUOpWire.setValue(ALU_FUNCT_CODES.SUB);
                    break;
                case FUNCTION_BITFIELD.SLT:
                    this.ALUOpWire.setValue(ALU_FUNCT_CODES.SLT);
                    break;
                case FUNCTION_BITFIELD.NOR:
                    this.ALUOpWire.setValue(ALU_FUNCT_CODES.NOR);
                    break;
                default:
                    throw new Error(`Function bitfield ${numberToBinary(functionField, 6)} is not valid.`);
            }
        } else if (isIFormat) {
            this.regDstWire.setLow();
            this.jumpWire.setLow();
            this.branchEqualWire.setLow();
            this.branchNotEqualWire.setLow();
            this.memReadWire.setLow();
            this.memToRegWire.setLow();
            // this.ALUOpWire.setValue(0b00);
            this.memWriteWire.setLow();
            this.ALUSrcWire.setHigh();
            this.regWriteWire.setHigh();

            switch (opcode) {
                case OPCODES.ANDI:
                    this.ALUOpWire.setValue(ALU_FUNCT_CODES.ADD);
                    this.extTypeWire.setValue(0b0);
                    break;
                case OPCODES.ORI:
                    this.ALUOpWire.setValue(ALU_FUNCT_CODES.OR);
                    this.extTypeWire.setValue(0b0);
                    break;
                case OPCODES.ADDI:
                    this.ALUOpWire.setValue(ALU_FUNCT_CODES.ADD);
                    this.extTypeWire.setValue(0b1);
                    break;
                // case OPCODES.SUBI: // This instruction doesn't exist, at least not in the reading I did
                //     this.ALUOpWire.setValue(ALU_FUNCT_CODES.SUB);
                //     break;
                case OPCODES.SLTI:
                    this.ALUOpWire.setValue(ALU_FUNCT_CODES.SLT);
                    this.extTypeWire.setValue(0b0);
                    break;
                // case OPCODES.NORI: // This instruction doesn't exist, at least not in the reading I did
                //     this.ALUOpWire.setValue(ALU_FUNCT_CODES.NOR);
                //     break;
                default:
                    throw new Error(`Function bitfield ${numberToBinary(functionField, 6)} is not valid.`);
            }
        } else if (isBeq) {
            this.jumpWire.setLow();
            this.branchEqualWire.setHigh();
            this.branchNotEqualWire.setLow();
            this.memReadWire.setLow();
            this.ALUOpWire.setValue(ALU_FUNCT_CODES.SUB);
            this.memWriteWire.setLow();
            this.ALUSrcWire.setLow();
            this.regWriteWire.setLow();
            this.extTypeWire.setLow();
        } else if (isBne) {
            this.jumpWire.setLow();
            this.branchEqualWire.setLow();
            this.branchNotEqualWire.setHigh();
            this.memReadWire.setLow();
            this.ALUOpWire.setValue(ALU_FUNCT_CODES.SUB);
            this.memWriteWire.setLow();
            this.ALUSrcWire.setLow();
            this.regWriteWire.setLow();
            this.extTypeWire.setLow();
        } else if (isJump) {
            this.jumpWire.setHigh();
            this.branchEqualWire.setLow();
            this.branchNotEqualWire.setLow();
            this.memReadWire.setLow();
            this.memWriteWire.setLow();
            this.regWriteWire.setLow();
            this.extTypeWire.setLow();
        } else {
            throw new Error(`Opcode ${numberToBinary(opcode, 6)} is not valid.`);
        }
    }

}