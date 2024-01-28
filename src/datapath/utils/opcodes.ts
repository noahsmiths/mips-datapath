export enum OPCODES {
    LW = 0b100000,
    SW = 0b101011,
    BEQ = 0b000100,
    J = 0b000010,
    ADD = 0b000000,
    ADDI = 0b001000,
    SUB = 0b000000,
    AND = 0b000000,
    ANDI = 0b001100,
    OR = 0b000000,
    ORI = 0b001101,
    SLT = 0b000000,
    SLTI = 0b001010
}