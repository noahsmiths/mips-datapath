import { Component } from "./component";
import { Wire } from "./wire";

export class TwoToOneMux implements Component {
    constructor(
        private inputWire1: Wire,
        private inputWire2: Wire,
        private selectWire: Wire,
        private outputWire: Wire,
    ) {}

    trigger(): void {
        const selectBit = this.selectWire.getValue();

        if (selectBit === 0) {
            this.outputWire.setValue(this.inputWire1.getValue());
        } else if (selectBit === 1) {
            this.outputWire.setValue(this.inputWire2.getValue());
        }
    }

}