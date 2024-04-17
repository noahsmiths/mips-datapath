import $ from 'jquery';
import { buildDatapath } from './datapath/fullDatapath';
import overlay from './datapath-overlay.json';
import { assemble } from './datapath/utils/assembler';
import binaryToMips from './scripts/instructioninfo';
import { coerceToSigned32BitNumber, numberToBinary, numberToHex } from './datapath/utils/convert';

let { dumpables, runCycle } = buildDatapath(0, {});
let activeElement: string | null = null;

const instructionsInput = $("#instructions-input");

const runCycleBtn = $("#run-cycle-button");
const loadBtn = $("#load-button");

const activeInstruction = $("#active-instruction");
const componentTitle = $("#component-title");
const componentValues = $("#component-values");
const diagram = $("#diagram");

loadBtn.on("click", () => {
    try {
        const beginningOffset = 0x00004000;
        const assembly = assemble(beginningOffset, (instructionsInput.val() as string).trim().replace(/\$0/g, '$zero'));
        const createdDatapath = buildDatapath(beginningOffset, assembly);

        dumpables = createdDatapath.dumpables;
        runCycle = createdDatapath.runCycle;

        componentTitle.text("");
        componentValues.html("");
        activeInstruction.text("Ready to run");
        alert("Program loaded and datapath reset. Hit the 'Run Cycle' button to start.");
    } catch (err) {
        console.error(err);
        activeInstruction.text("Error assembling");
        alert("********ERROR********\n An error occured when trying to assemble your program. Please make sure you entered valid assembly and try again.");
    }
});
runCycleBtn.on("click", () => {
    try {
        runCycle();

        const value = parseInt(dumpables['imOut'].dumpData().value).toString(2).padStart(32, '0');
        activeInstruction.text(binaryToMips(value));

        componentTitle.text("");
        componentValues.html("");
    } catch (err) {
        console.error(err);

        if (err.message.includes('No instruction defined at given address')) {
            activeInstruction.text('No active instruction');
        }
    }

    displayElementData(activeElement);
});
diagram.on("mousemove", handleDiagramMouseOver);
diagram.on("mouseenter", () => {
    diagram.off("mousemove", handleDiagramMouseOver);
    diagram.on("mousemove", handleDiagramMouseOver);
});
diagram.on("click", (event) => {
    diagram.off("mousemove", handleDiagramMouseOver);
    handleDiagramMouseOver(event);
    diagram.css("cursor", "unset");
});

function handleDiagramMouseOver(event) {
    const diagramOffset = diagram.offset()!;
    const normalizedX = (window.scrollX + event.clientX - diagramOffset.left) / (diagram.width()!);
    const normalizedY = (window.scrollY + event.clientY - diagramOffset.top) / (diagram.height()!);

    activeElement = findActiveElement(normalizedX, normalizedY);
    displayElementData(activeElement);

    if (activeElement !== null && activeElement in dumpables) {
        diagram.css("cursor", "pointer");
    } else {
        diagram.css("cursor", "unset");
    }
}

function displayElementData(element: string | null) {
    if (element === null || !(element in dumpables)) return;

    componentTitle.text(element);
    componentValues.html("");

    const component = dumpables[element];
    const componentData = component.dumpData();
    for (let key in componentData) {
        const nameData = document.createElement("td");
        nameData.innerText = key;

        const value = componentData[key];
        const decValue = document.createElement('td');
        decValue.innerText = coerceToSigned32BitNumber(value).toString();

        const hexValue = document.createElement('td');
        hexValue.innerText = "0x" + numberToHex(value, component.getBitSize());

        const binValue = document.createElement('td');
        binValue.innerText = "0b" + numberToBinary(value, component.getBitSize());

        const dataRow = document.createElement('tr');
        dataRow.className = "[&>*]:border";
        dataRow.appendChild(nameData);
        dataRow.appendChild(hexValue);
        dataRow.appendChild(binValue);
        dataRow.appendChild(decValue);
        componentValues.append(dataRow);
    }
}

function findActiveElement(x: number, y: number): string | null {
    for (let component in overlay) {
        for (let bound of overlay[component]) {
            if (bound.left < x && x < bound.right && bound.top < y && y < bound.bottom) {
                return component;
            }
        }
    }

    return null;
}