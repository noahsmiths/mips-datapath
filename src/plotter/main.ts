import $ from 'jquery';
import overlay from '../datapath-overlay.json';

const img = $("#image");

img.on("mousedown", recordCoords);
$(window).on("keypress", insertBreak);

let coords: any = [];
let calculatedCoords: any = [];
globalThis.calculatedCoords = calculatedCoords;

function insertBreak(event) {
    if (event.keyCode === 32) {
        event.preventDefault();
        calculatedCoords.push({
            TYPE: "BREAK"
        });

        navigator.clipboard.writeText(JSON.stringify(calculatedCoords, null, '\t'));
    } else if (event.key === "e") {
        replayOverlay();
    } else if (event.key === "r") {
        coords = [];
        calculatedCoords = [];
        navigator.clipboard.writeText("");
    } else if (event.key === "q") {
        window.location.reload();
    }
}

function replayOverlay() {
    const imgWidth = img.width()!;
    const imgHeight = img.height()!;

    for (let bounds of Object.values(overlay)) {
        for (let bound of bounds) {
            let box = document.createElement("div");
            box.style.top = `${imgHeight * bound.top}px`;
            box.style.left = `${imgWidth * bound.left}px`;
            box.style.width = `${imgWidth * (bound.right - bound.left)}px`;
            box.style.height = `${imgHeight * (bound.bottom - bound.top)}px`;
            box.style.position = "absolute";
            box.style.backgroundColor = "green";
            box.style.zIndex = "-1";
            $("#overlay").append(box);
        }
    }
}

function recordCoords(event) {
    coords.push({
        x: window.scrollX + event.clientX,
        y: window.scrollY + event.clientY,
    });

    console.log(coords);

    if (coords.length === 4) {
        let [top, right, bottom, left] = coords;
        const imgWidth = img.width()!;
        const imgHeight = img.height()!;

        console.log(imgWidth);

        let box = document.createElement("div");
        box.style.top = `${top.y}px`;
        box.style.left = `${left.x}px`;
        box.style.width = `${right.x - left.x}px`;
        box.style.height = `${bottom.y - top.y}px`;
        box.style.position = "absolute";
        box.style.backgroundColor = "red";
        // box.style.opacity = "0.5";
        box.style.zIndex = "-1";
        $("#overlay").append(box);

        calculatedCoords.push({
            top: top.y / imgHeight,
            right: right.x / imgWidth,
            bottom: bottom.y / imgHeight,
            left: left.x / imgWidth,
        });

        navigator.clipboard.writeText(JSON.stringify(calculatedCoords, null, '\t'));

        coords = [];
    }
}