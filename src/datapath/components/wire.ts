import { numberToBinary } from "../utils/convert";
import { Dumpable } from "./dumpable";

interface WireSpec extends Dumpable {
    setValue(value: number): void;
    getValue(): number;

    getBits(lower: number, upper: number): number;
}

export class Wire implements WireSpec {
    private value: number = 0;
    private maxValue: number;

    constructor(
        private bitSize: number = 1
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
        const leftBound = this.bitSize - (upper + 1);
        const rightBound = this.bitSize - (lower + 1);
        return parseInt(numberToBinary(this.value).substring(leftBound, rightBound), 2);
    }
    dumpData(): { [key: string]: any } {
        return {
            "value": this.value
        };
    }
}