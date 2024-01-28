import { coerceToUnsigned32BitNumber } from "../utils/convert";
import { Component } from "./component";
import { Dumpable } from "./dumpable";
import { Wire } from "./wire";

export class LeftShifter implements Component, Dumpable {
    constructor(
        private inputWire: Wire,
        private outputWire: Wire,
        private shiftAmount: number
    ) {}

    trigger(): void {
        const inputvalue = this.inputWire.getValue();
        const leftShiftedValue = coerceToUnsigned32BitNumber(inputvalue << this.shiftAmount);

        this.outputWire.setValue(leftShiftedValue);
    }
    dumpData(): { [key: string]: any; } {
        return {}
    }

}