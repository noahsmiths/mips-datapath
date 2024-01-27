import { Component } from "./component";
import { Dumpable } from "./dumpable";
import { Wire } from "./wire";

export class ShiftLeftTwo implements Component, Dumpable {
    constructor(
        private inputWire: Wire,
        private outputWire: Wire
    ) {}

    trigger(): void {
        const inputvalue = this.inputWire.getValue();
        const leftShiftedValue = inputvalue << 2;

        this.outputWire.setValue(leftShiftedValue);
    }
    dumpData(): { [key: string]: any; } {
        return {}
    }

}