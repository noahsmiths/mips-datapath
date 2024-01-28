import { coerceToUnsigned32BitNumber } from "../utils/convert";
import { Component } from "./component";
import { Wire } from "./wire";

export class BaseAdder implements Component {
    constructor(
        private inputWire1: Wire,
        private inputWire2: Wire,
        private outputWire: Wire,
    ) {}

    trigger(): void {
        const sum = coerceToUnsigned32BitNumber(this.inputWire1.getValue() + this.inputWire2.getValue());

        this.outputWire.setValue(sum);
    }

}