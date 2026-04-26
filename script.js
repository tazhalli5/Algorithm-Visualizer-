let array = [];
const container = document.getElementById("container");

const complexities = {
    bubble: { time: "O(n²)", space: "O(1)" },
    insertion: { time: "O(n²)", space: "O(1)" },
    merge: { time: "O(n log n)", space: "O(n)" },
    quick: { time: "O(n log n)", space: "O(log n)" }
};

// Helper: Safely gets delay. Defaults to 50ms if slider is missing.
function sleep() {
    const slider = document.getElementById("speedDelay") || document.getElementById("speed");
    const ms = slider ? slider.value : 50;
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateComplexityInfo() {
    const selection = document.getElementById("algoSelect").value;
    const timeDiv = document.getElementById("time-complexity");
    const spaceDiv = document.getElementById("space-complexity");

    if (complexities[selection] && timeDiv && spaceDiv) {
        timeDiv.innerText = complexities[selection].time;
        spaceDiv.innerText = complexities[selection].space;
    }
}

function resetArray() {
    if (!container) return;
    container.innerHTML = "";
    array = [];
    // Responsive bar count
    const count = window.innerWidth < 600 ? 15 : 40;
    
    for (let i = 0; i < count; i++) {
        let val = Math.floor(Math.random() * 250) + 10;
        array.push(val);
        const bar = document.createElement("div");
        bar.style.height = `${val}px`;
        bar.classList.add("bar");
        container.appendChild(bar);
    }
}

async function startSorting() {
    const algoSelect = document.getElementById("algoSelect");
    if (!algoSelect) return alert("Select menu not found!");
    
    const selection = algoSelect.value;
    if (!selection) return alert("Please select an algorithm first!");

    // Disable all UI elements while sorting
    const controls = document.querySelectorAll("button, select, input");
    controls.forEach(c => c.disabled = true);

    // Call the correct function based on dropdown value
    if (selection === "bubble") await bubbleSort();
    else if (selection === "insertion") await insertionSort();
    else if (selection === "merge") await mergeSort();
    else if (selection === "quick") await quickSort();

    // Re-enable UI
    controls.forEach(c => c.disabled = false);
}

// --- Algorithms ---

async function bubbleSort() {
    let bars = document.getElementsByClassName("bar");
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            bars[j].style.backgroundColor = "#ef4444"; // Red for compare
            bars[j+1].style.backgroundColor = "#ef4444";
            await sleep();
            if (array[j] > array[j+1]) {
                [array[j], array[j+1]] = [array[j+1], array[j]];
                bars[j].style.height = `${array[j]}px`;
                bars[j+1].style.height = `${array[j+1]}px`;
            }
            bars[j].style.backgroundColor = "#6366f1"; // Reset to Indigo
            bars[j+1].style.backgroundColor = "#6366f1";
        }
        bars[array.length - i - 1].style.backgroundColor = "#10b981"; // Green for sorted
    }
    bars[0].style.backgroundColor = "#10b981";
}

async function insertionSort() {
    let bars = document.getElementsByClassName("bar");
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        bars[i].style.backgroundColor = "#ef4444";
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            bars[j + 1].style.height = `${array[j + 1]}px`;
            bars[j + 1].style.backgroundColor = "#f59e0b"; // Orange for moving
            j--;
            await sleep();
        }
        array[j + 1] = key;
        bars[j + 1].style.height = `${key}px`;
        for (let k = 0; k <= i; k++) bars[k].style.backgroundColor = "#10b981";
    }
}

async function mergeSort() {
    await mSort(0, array.length - 1);
    let bars = document.getElementsByClassName("bar");
    for (let bar of bars) bar.style.backgroundColor = "#10b981";
}

async function mSort(start, end) {
    if (start >= end) return;
    let mid = Math.floor((start + end) / 2);
    await mSort(start, mid);
    await mSort(mid + 1, end);
    await merge(start, mid, end);
}

async function merge(start, mid, end) {
    let bars = document.getElementsByClassName("bar");
    let left = array.slice(start, mid + 1);
    let right = array.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length) {
        await sleep();
        if (left[i] <= right[j]) array[k] = left[i++];
        else array[k] = right[j++];
        bars[k].style.height = `${array[k]}px`;
        bars[k].style.backgroundColor = "#ef4444";
        k++;
    }
    while (i < left.length) {
        await sleep();
        array[k] = left[i++];
        bars[k].style.height = `${array[k]}px`;
        k++;
    }
    while (j < right.length) {
        await sleep();
        array[k] = right[j++];
        bars[k].style.height = `${array[k]}px`;
        k++;
    }
}

async function quickSort() {
    let bars = document.getElementsByClassName("bar");
    await qSort(0, array.length - 1, bars);
    // Success finish
    for (let i = 0; i < bars.length; i++) {
        bars[i].style.backgroundColor = "#10b981";
    }
}

async function qSort(start, end, bars) {
    if (start >= end) return;
    let index = await partition(start, end, bars);
    // Sequential recursion for animation stability
    await qSort(start, index - 1, bars);
    await qSort(index + 1, end, bars);
}

async function partition(start, end, bars) {
    let pivotValue = array[end];
    let pivotIndex = start;
    bars[end].style.backgroundColor = "#ef4444"; // Red pivot

    for (let i = start; i < end; i++) {
        bars[i].style.backgroundColor = "#f59e0b"; // Scanning color
        await sleep();
        if (array[i] < pivotValue) {
            [array[i], array[pivotIndex]] = [array[pivotIndex], array[i]];
            bars[i].style.height = `${array[i]}px`;
            bars[pivotIndex].style.height = `${array[pivotIndex]}px`;
            pivotIndex++;
        }
        bars[i].style.backgroundColor = "#6366f1";
    }
    [array[pivotIndex], array[end]] = [array[end], array[pivotIndex]];
    bars[pivotIndex].style.height = `${array[pivotIndex]}px`;
    bars[end].style.height = `${array[end]}px`;
    bars[pivotIndex].style.backgroundColor = "#10b981";
    return pivotIndex;
}

// Ensure the first array is drawn when page loads
document.addEventListener("DOMContentLoaded", resetArray);
