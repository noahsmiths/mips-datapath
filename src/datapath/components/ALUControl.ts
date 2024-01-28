import { Component } from "./component";
import { Wire } from "./wire";

export class ALUControl implements Component {
    constructor(
        private instructionWire: Wire,
        private ALUOpWire: Wire,
        private outputWire: Wire,
    ) {}

    trigger(): void {
        throw new Error("Method not implemented.");
    }

}