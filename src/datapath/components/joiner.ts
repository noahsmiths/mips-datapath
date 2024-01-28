import { binaryToUnsigned32BitNumber } from "../utils/convert";
import { Component } from "./component";
import { Wire } from "./wire";

export class Joiner implements Component {
    constructor(
        private inputWire1: Wire,
        private inputWire2: Wire,
        private outputWire: Wire,
    ) {}
        
    trigger(): void {
        const input1Binary: string = this.inputWire1.getBinary();
        const input2Binary: string = this.inputWire2.getBinary();
        const concatedValue: number = binaryToUnsigned32BitNumber(input1Binary + input2Binary);
        
        this.outputWire.setValue(concatedValue);
    }

}