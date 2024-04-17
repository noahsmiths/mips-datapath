import { Component } from "./component";
import { Dumpable } from "./dumpable";
import { Wire } from "./wire";

const registerNames = ['zero', 'at', 'v0', 'v1', 'a0', 'a1', 'a2', 'a3', 't0', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 's0', 's1', 's2', 's3', 's4', 's5', 's6', 's7', 't8', 't9', 'k0', 'k1', 'gp', 'sp', 'fp', 'ra'];

export class Registers implements Component, Dumpable {
    constructor(
        private readReg1Wire: Wire,
        private readReg2Wire: Wire,
        private writeRegWire: Wire,
        private writeDataWire: Wire,
        private regWriteWire: Wire,
        private outputReadReg1Wire: Wire,
        private outputReadReg2Wire: Wire,
        private registerFile: Array<number> = new Array(32).fill(0)
    ) {}

    writeValue(): void {
        const regWrite: boolean = this.regWriteWire.getValue() === 1;

        if (regWrite) {
            const writeRegister: number = this.writeRegWire.getValue();
            this.registerFile[writeRegister] = this.writeDataWire.getValue();
        }
    }
    trigger(): void {
        // Should maybe call writeValue here
        const readReg1 = this.readReg1Wire.getValue();
        const readReg2 = this.readReg2Wire.getValue();

        this.outputReadReg1Wire.setValue(this.registerFile[readReg1]);
        this.outputReadReg2Wire.setValue(this.registerFile[readReg2]);
    }
    dumpData(): { [key: string]: any; } {
        const dict = {};

        for (let i = 0; i < this.registerFile.length; i++) {
            dict[`[${i}] $` + registerNames[i]] = this.registerFile[i];
        }

        return dict;
    }
    getBitSize(): number {
        return 32;
    }
}