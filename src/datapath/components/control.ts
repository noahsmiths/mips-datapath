import { Component } from "./component";
import { Dumpable } from "./dumpable";
import { Wire } from "./wire";

export class Control implements Component, Dumpable {
    constructor(
        private inputWire: Wire,
        private regDstWire: Wire,
        private jumpWire: Wire,
        private branchWire: Wire,
        private memReadWire: Wire,
        private memToRegWire: Wire,
        private ALUOpWire: Wire,
        private memWriteWire: Wire,
        private ALUSrcWire: Wire,
        private regWriteWire: Wire,
    ) {}

    trigger(): void {
        throw new Error("Method not implemented.");
    }
    dumpData(): { [key: string]: any; } {
        throw new Error("Method not implemented.");
    }

}