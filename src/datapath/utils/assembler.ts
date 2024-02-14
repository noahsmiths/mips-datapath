import { assemble as mipsAssemble } from "mips-assembler";

export function assemble(beginning: number, assembly: string, ): { [key: string]: number } {
    let assemblerOutput = mipsAssemble(`.org 0x${beginning.toString(16).padStart(8, "0")}\n${assembly}`) as ArrayBuffer;
    console.log(assemblerOutput);
    let parsedOutput = {};

    function concatSlice(slice: ArrayBuffer) {
        return parseInt([...new Uint8Array(slice)].reduce((prev, current) => prev + current.toString(16).padStart(2, "0"), ""), 16);
    }

    for (let i = 0; i < assemblerOutput.byteLength; i += 4) {
        parsedOutput[beginning + i] = concatSlice(assemblerOutput.slice(i, i + 4));
    }

    return parsedOutput;
}