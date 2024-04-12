import { binaryToUnsigned32BitNumber } from "../utils/convert";
import { Component } from "./component";
import { Wire } from "./wire";

export class SignExtender implements Component {
    constructor(
        private inputWire: Wire,
        private outputWire: Wire,
        private extTypeWire: Wire,
        private outputBitCount: number
    ) {}

    trigger(): void {
        let inputBinary = this.inputWire.getBinary();
        let padChar = this.extTypeWire.getValue() > 0 ? inputBinary.charAt(0) : 0;

        for (let i = inputBinary.length; i < this.outputBitCount; i++) {
            inputBinary = padChar + inputBinary;
        }

        this.outputWire.setValue(binaryToUnsigned32BitNumber(inputBinary));
    }

}