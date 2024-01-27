export function numberToBinary(value: number): string {
    return value.toString(2);
}

export function binaryToUnsignedNumber(value: string): number {
    return parseInt(value, 2);
}

export function binaryToSigned32BitNumber(value: string): number {
    return ~~parseInt(value, 2);
}