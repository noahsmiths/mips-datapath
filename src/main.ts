import $ from 'jquery';
import { buildDatapath } from './datapath/fullDatapath';
import overlay from './datapath-overlay.json';
import { assemble } from './datapath/utils/assembler';

let { dumpables, runCycle } = buildDatapath(0, {});

const instructionsInput = $("#instructions-input");

const runCycleBtn = $("#run-cycle-button");
const loadBtn = $("#load-button");

const details = $("#details");
const diagram = $("#diagram");

loadBtn.on("click", () => {
    try {
        const beginningOffset = 0x00004000;
        const assembly = assemble(beginningOffset, (instructionsInput.val() as string).trim());
        const createdDatapath = buildDatapath(beginningOffset, assembly);

        dumpables = createdDatapath.dumpables;
        runCycle = createdDatapath.runCycle;

        alert("Program loaded and datapath reset. Hit the 'Run Cycle' button to start.");
    } catch (err) {
        console.error(err);
        alert("Error when trying to assemble your program. Please make sure you entered valid assembly.");
    }
});
runCycleBtn.on("click", () => {
    runCycle();
});
diagram.on("mousemove", handleDiagramMouseOver);

function handleDiagramMouseOver(event) {
    const diagramOffset = diagram.offset()!;
    const normalizedX = (window.scrollX + event.clientX - diagramOffset.left) / (diagram.width()!);
    const normalizedY = (window.scrollY + event.clientY - diagramOffset.top) / (diagram.height()!);

    const activeElement = findActiveElement(normalizedX, normalizedY);

    if (activeElement !== null && activeElement in dumpables) {
        details.text(activeElement + "\n" + JSON.stringify(dumpables[activeElement].dumpData()));
        diagram.css("cursor", "pointer");
    } else {
        diagram.css("cursor", "unset");
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