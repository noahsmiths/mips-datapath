import { binaryToUnsigned32BitNumber, numberToBinary } from "../utils/convert";
import { Dumpable } from "./dumpable";

// interface WireSpec extends Dumpable {
//     setValue(value: number): void;
//     getValue(): number;

//     getBits(lower: number, upper: number): number;
// }

export class Wire implements Dumpable {
    private maxValue: number;

    constructor(
        private bitSize: number = 1,
        private value: number = 0 // Unsigned values always used in value
    ) {
        this.maxValue = (2 ** this.bitSize) - 1;
    }

    setValue(value: number): void {
        if (value > this.maxValue || value < 0) {
            throw new Error(`Value ${value} is out of bounds: [0, ${this.maxValue}].`);
        }
        this.value = value;
    }
    getValue(): number {
        return this.value;
    }
    setHigh(): void {
        this.value = this.maxValue;
    }
    setLow(): void {
        this.value = 0;
    }
    getBits(lower: number, upper: number): number { // Inclusive bounds
        const leftBound = this.bitSize - (upper);
        const rightBound = this.bitSize - (lower - 1);
        return binaryToUnsigned32BitNumber(numberToBinary(this.value, this.bitSize).substring(leftBound, rightBound));
    }
    getBinary(): string {
        return numberToBinary(this.value, this.bitSize);
    }
    dumpData(): { [key: string]: any } {
        return {
            "value": this.getBinary()
        };
    }
}