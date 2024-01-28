import { Component } from "./component";
import { Wire } from "./wire";

export class ALU implements Component {
    constructor(
        private inputWire1: Wire,
        private inputWire2: Wire,
        private controlWire: Wire,
        private outputWire: Wire,
        private zeroWire: Wire,
    ) {}

    // TODO: Implement
    trigger(): void {
        throw new Error("Method not implemented.");
    }

}