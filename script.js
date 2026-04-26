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
/**
 * Quick Sort Implementation with Visualization
 * @param {Array} rects - The DOM elements representing the bars
 * @param {number} left - Starting index
 * @param {number} right - Ending index
 */
async function quickSort(rects, left, right) {
    if (left < right) {
        // Find the partition index
        let pivotIndex = await partition(rects, left, right);
        
        // Recursively sort elements before and after partition
        await quickSort(rects, left, pivotIndex - 1);
        await quickSort(rects, pivotIndex + 1, right);
    }
    // Once finished, ensure all bars are the primary color
    if (left === 0 && right === rects.length - 1) {
        rects.forEach(rect => rect.style.backgroundColor = "#7582f4");
    }
}

async function partition(rects, left, right) {
    // Picking the rightmost element as pivot
    let pivotValue = parseInt(rects[right].style.height);
    rects[right].style.backgroundColor = "red"; // Highlight Pivot

    let i = left - 1;

    for (let j = left; j < right; j++) {
        // Highlight current comparison
        rects[j].style.backgroundColor = "yellow";
        
        // Delay for visualization based on your speed slider
        await new Promise(resolve => setTimeout(resolve, speed));

        if (parseInt(rects[j].style.height) < pivotValue) {
            i++;
            // Swap elements in the DOM
            swap(rects[i], rects[j]);
        }
        
        // Reset color after comparison
        rects[j].style.backgroundColor = "#7582f4";
    }

    // Place pivot in the correct position
    swap(rects[i + 1], rects[right]);
    rects[right].style.backgroundColor = "#7582f4";
    
    return i + 1;
}

function swap(el1, el2) {
    let tempHeight = el1.style.height;
    el1.style.height = el2.style.height;
    el2.style.height = tempHeight;
}


// Ensure the first array is drawn when page loads
document.addEventListener("DOMContentLoaded", resetArray);
