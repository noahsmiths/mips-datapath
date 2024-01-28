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

    trigger(): void {
        const address = this.addressWire.getValue();
        const isMemRead = this.memReadWire.getValue() === 1;
        const isMemWrite = this.memWriteWire.getValue() === 1;

        if (isMemRead) {
            const value = this.memory[address] || 0; // Return 0 if memory doesn't contain data at address
            this.outputWire.setValue(value);
        } else if (isMemWrite) {
            this.memory[address] = this.writeDataWire.getValue();
        }
    }
    dumpData(): { [key: string]: any; } {
        return {...this.memory};
    }

}