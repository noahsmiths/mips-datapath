import { coerceToUnsigned32BitNumber, numberToBinary } from "../utils/convert";
import { FUNCT_CODES } from "../utils/functCodes";
import { Component } from "./component";
import { Wire } from "./wire";

export class ALU implements Component {
    constructor(
        private inputWireA: Wire,
        private inputWireB: Wire,
        private controlWire: Wire,
        private outputWire: Wire,
        private zeroWire: Wire,
    ) {}

    trigger(): void {
        const inputA = this.inputWireA.getValue();
        const inputB = this.inputWireB.getValue();
        const controlCode = this.controlWire.getValue();

        switch (controlCode) {
            case FUNCT_CODES.ADD:
                const sum = coerceToUnsigned32BitNumber(inputA + inputB);
                this.outputWire.setValue(sum);
                break;
            case FUNCT_CODES.SUBTRACT:
                const difference = coerceToUnsigned32BitNumber(inputA - inputB);
                this.outputWire.setValue(difference);
                this.zeroWire.setValue(difference === 0 ? 1 : 0);
                break;
            case FUNCT_CODES.AND:
                const and = coerceToUnsigned32BitNumber(inputA & inputB);
                this.outputWire.setValue(and);
                break;
            case FUNCT_CODES.OR:
                const or = coerceToUnsigned32BitNumber(inputA | inputB);
                this.outputWire.setValue(or);
                break;
            case FUNCT_CODES.SLT:
                this.outputWire.setValue(inputA < inputB ? 1 : 0);
                break;
            default:
                throw new Error(`ALU Control Code ${numberToBinary(controlCode, 3)} is invalid.`);
        }
    }

}