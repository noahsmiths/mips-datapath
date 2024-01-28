import { binaryToUnsigned32BitNumber } from "../utils/convert";
import { Component } from "./component";
import { Wire } from "./wire";

export class SignExtender implements Component {
    constructor(
        private inputWire: Wire,
        private outputWire: Wire,
        private outputBitCount: number
    ) {}

    trigger(): void {
        let inputBinary = this.inputWire.getBinary();

        for (let i = inputBinary.length; i <= this.outputBitCount; i++) {
            inputBinary = inputBinary.charAt(0) + inputBinary;
        }

        this.outputWire.setValue(binaryToUnsigned32BitNumber(inputBinary));
    }

}