import { Component } from "./component";
import { Wire } from "./wire";

export class Or implements Component {
    constructor(
        private inputWire1: Wire,
        private inputWire2: Wire,
        private outputWire: Wire,
    ) {}

    trigger(): void {
        const bitwiseAnd = this.inputWire1.getValue() | this.inputWire2.getValue();
        this.outputWire.setValue(bitwiseAnd);
    }

}