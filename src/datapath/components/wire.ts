import { Component } from "./component";

interface Wire extends Component {
    setValue(value: number): void;
    getValue(): number;

    getBits(lower: number, upper: number): number;
    
}