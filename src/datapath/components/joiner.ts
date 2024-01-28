import { binaryToUnsigned32BitNumber, numberToBinary } from "../utils/convert";
import { Component } from "./component";
import { Wire } from "./wire";

export class Joiner implements Component {
    constructor(
        private inputWire1: Wire,
        private inputWire2: Wire,
        private outputWire: Wire,
    ) {}
        
    trigger(): void {
        const input1Binary: string = numberToBinary(this.inputWire1.getValue());
        const input2Binary: string = numberToBinary(this.inputWire2.getValue());
        const concatedValue: number = binaryToUnsigned32BitNumber(input1Binary + input2Binary);
        
        this.outputWire.setValue(concatedValue);
    }

}