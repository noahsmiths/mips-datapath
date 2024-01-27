import { Component } from "./component";
import { Dumpable } from "./dumpable";
import { Wire } from "./wire";

// Takes bits [lowerBitIndex, upperBitIndex] from inputWire and writes them to outputWire
export class Splicer implements Component, Dumpable {
    constructor(
        private inputWire: Wire,
        private outputWire: Wire,
        private lowerBitIndex: number,
        private upperBitIndex: number
    ) {}

    trigger(): void {
        const selectedBits = this.inputWire.getBits(this.lowerBitIndex, this.upperBitIndex);
        this.outputWire.setValue(selectedBits);
    }
    dumpData(): { [key: string]: any; } {
        return {};
    }

}