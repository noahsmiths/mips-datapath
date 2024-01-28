import { numberToBinary } from "../utils/convert";
import { FUNCT_CODES } from "../utils/functCodes";
import { Component } from "./component";
import { Wire } from "./wire";

export class ALUControl implements Component {
    constructor(
        private instructionWire: Wire,
        private ALUOpWire: Wire,
        private outputWire: Wire,
    ) {}

    trigger(): void {
        const funct = this.instructionWire.getValue();
        const ALUOp = this.ALUOpWire.getValue();

        // Codes from https://www.cs.fsu.edu/~hawkes/cda3101lects/chap5/index.html?$$$F5.14.html$$$
        switch (ALUOp) {
            case 0b00: // Memory
                this.outputWire.setValue(FUNCT_CODES.ADD);
                break;
            case 0b01: // Branch
                this.outputWire.setValue(FUNCT_CODES.SUBTRACT);
                break;
            case 0b10:
                // Yucky nested switch, maybe just use a dict here or something idk
                switch (funct) {
                    case 0b100000:
                        this.outputWire.setValue(FUNCT_CODES.ADD);
                        break;
                    case 0b100010:
                        this.outputWire.setValue(FUNCT_CODES.SUBTRACT);
                        break;
                    case 0b100100:
                        this.outputWire.setValue(FUNCT_CODES.AND);
                        break;
                    case 0b100101:
                        this.outputWire.setValue(FUNCT_CODES.OR);
                        break;
                    case 0b101010:
                        this.outputWire.setValue(FUNCT_CODES.SLT);
                        break;
                    default:
                        throw new Error(`Invalid funct: ${numberToBinary(funct)} and ALUOp: ${numberToBinary(ALUOp)} combination.`);
                }
                break;
            default:
                throw new Error(`Invalid ALUOp: ${numberToBinary(ALUOp)}.`);
        }
    }

}