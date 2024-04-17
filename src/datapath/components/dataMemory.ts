import { numberToHex } from "../utils/convert";
import { Component } from "./component";
import { Dumpable } from "./dumpable";
import { Wire } from "./wire";

export class DataMemory implements Component, Dumpable {
    constructor(
        private addressWire: Wire,
        private writeDataWire: Wire,
        private memReadWire: Wire,
        private memWriteWire: Wire,
        private outputWire: Wire,
        private memory: { [key: number]: number } = {}
    ) {}

    writeValue(): void {
        const address = this.addressWire.getValue();
        const isMemWrite = this.memWriteWire.getValue() === 1;

        if (isMemWrite) {
            this.memory[address] = this.writeDataWire.getValue();
        }
    }
    trigger(): void {
        const address = this.addressWire.getValue();
        const isMemRead = this.memReadWire.getValue() === 1;

        if (isMemRead) {
            const value = this.memory[address] || 0; // Return 0 if memory doesn't contain data at address
            this.outputWire.setValue(value);
        }
    }
    dumpData(): { [key: string]: any; } {
        const formattedData = {};
        for (const word in this.memory) {
            let key = "0x" + numberToHex(parseInt(word), 32);
            formattedData[key] = this.memory[word];
        }
        return formattedData;
    }
    getBitSize(): number {
        return 32;
    }
}