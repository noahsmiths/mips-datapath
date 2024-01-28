import { Component } from "./component";
import { Dumpable } from "./dumpable";
import { Wire } from "./wire";

export class DataMemory implements Component, Dumpable {
    constructor(
        private addressWire: Wire,
        private writeDataWire: Wire,
        private memReadWire: Wire,
        private memWriteWire: Wire,
        private readDataWire: Wire,
        private memory: { [key: number]: number } = {}
    ) {}

    trigger(): void {
        throw new Error("Method not implemented.");
    }
    dumpData(): { [key: string]: any; } {
        throw new Error("Method not implemented.");
    }

}