export interface Dumpable {
    getBitSize(): number;
    dumpData(): { [key: string] : any };
}