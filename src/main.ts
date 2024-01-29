import $ from 'jquery';
import { buildDatapath } from './datapath/fullDatapath';
import overlay from './datapath-overlay.json';

const { dumpables, runCycle } = buildDatapath();

const runCycleBtn = $("#run-cycle-button");

const details = $("#details");
const diagram = $("#diagram");

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