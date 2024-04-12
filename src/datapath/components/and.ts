import { Component } from "./component";
import { Wire } from "./wire";

export class And implements Component {
    constructor(
        private inputWire1: Wire,
        private inputWire2: Wire,
        private outputWire: Wire,
        private negateFirstWire: boolean = false,
        private negateSecondWire: boolean = false
    ) {}

    trigger(): void {
        const firstValue = this.negateFirstWire ? +!this.inputWire1.getValue() : this.inputWire1.getValue();
        const secondValue = this.negateSecondWire ? +!this.inputWire2.getValue() : this.inputWire2.getValue();
        const bitwiseAnd = firstValue & secondValue;
        this.outputWire.setValue(bitwiseAnd);
    }

}