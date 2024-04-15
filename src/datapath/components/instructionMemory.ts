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
        return this.instructions;
    }
    
}