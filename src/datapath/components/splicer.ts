import { Component } from "./component";
import { Wire } from "./wire";

// Takes bits [lowerBitIndex, upperBitIndex] from inputWire and writes them to outputWire
export class Splicer implements Component {
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

}