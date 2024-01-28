export function numberToBinary(value: number, bits: number): string {
    let binaryString = coerceToUnsigned32BitNumber(value).toString(2);
    
    for (let i = binaryString.length; i <= bits; i++) {
        binaryString = "0" + binaryString;
    }
    return binaryString;
}

export function binaryToUnsigned32BitNumber(value: string): number {
    return coerceToUnsigned32BitNumber(parseInt(value, 2));
}

export function binaryToSigned32BitNumber(value: string): number {
    return coerceToSigned32BitNumber(parseInt(value, 2));
}

export function coerceToSigned32BitNumber(value: number): number {
    return ~~value;
}

export function coerceToUnsigned32BitNumber(value: number): number {
    return value >>> 0;
}