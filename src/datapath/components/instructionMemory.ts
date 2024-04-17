import { numberToHex } from "../utils/convert";
import { Component } from "./component";
import { Dumpable } from "./dumpable";
import { Wire } from "./wire";

export class InstructionMemory implements Component, Dumpable {
    constructor(
        private inputWire: Wire,
        private outputWire: Wire,
        private instructions: { [key: number]: number } = {}
    ) {}

    trigger(): void {
        const selectedInstruction = this.instructions[this.inputWire.getValue()];

        if (selectedInstruction === undefined) {
            throw new Error(`No instruction defined at given address ${this.inputWire.getValue()}.`);
        }

        this.outputWire.setValue(selectedInstruction);
    }
    dumpData(): { [key: string]: any; } {
        // return {
        //     "instructions": this.instructions
        // };
        const formattedData = {};
        for (const instruction in this.instructions) {
            let key = "0x" + numberToHex(parseInt(instruction), 32);
            formattedData[key] = this.instructions[instruction];
        }
        return formattedData;
    }
    getBitSize(): number {
        return 32;
    }
}