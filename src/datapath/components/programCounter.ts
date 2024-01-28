import { Component } from "./component";
import { Dumpable } from "./dumpable";
import { Wire } from "./wire";

export class ProgramCounter implements Component, Dumpable {
    private pcValue: number;

    constructor(
        private inputWire: Wire,
        private outputWire: Wire,
        // pcValue: number
    ) {
        // if (pcValue > (2 ** 32) - 1 || pcValue < 0) {
        //     throw new Error("pcValue must be in range of 32-bit unsigned integer.");
        // }

        // this.pcValue = pcValue;
    }

    trigger(): void {
        this.pcValue = this.inputWire.getValue();
        this.outputWire.setValue(this.pcValue);
    }
    dumpData(): { [key: string]: any; } {
        return {
            "PC": this.pcValue
        };
    }
    
}