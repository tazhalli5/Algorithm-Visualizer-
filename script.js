/**
 * Algorithm Visualiser 
 */

let array = [];
const container = document.getElementById("container");

const complexities = {
    bubble: { time: "O(n²)", space: "O(1)" },
    insertion: { time: "O(n²)", space: "O(1)" },
    merge: { time: "O(n log n)", space: "O(n)" },
    quick: { time: "O(n log n)", space: "O(log n)" }
};

// --- Helper Functions ---

function sleep() {
    const slider = document.getElementById("speedDelay") || document.getElementById("speed");
    
    const ms = slider ? parseInt(slider.value) : 50;
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
    const count = window.innerWidth < 600 ? 15 : 40;
    
    for (let i = 0; i < count; i++) {
        let val = Math.floor(Math.random() * 250) + 10;
        array.push(val);
        const bar = document.createElement("div");
        bar.style.height = `${val}px`;
        bar.classList.add("bar");
        // Initial color: Indigo
        bar.style.backgroundColor = "#6366f1"; 
        container.appendChild(bar);
    }
}

async function startSorting() {
    const algoSelect = document.getElementById("algoSelect");
    if (!algoSelect) return alert("Select menu not found!");
    
    const selection = algoSelect.value;
    if (!selection) return alert("Please select an algorithm first!");

    const controls = document.querySelectorAll("button, select, input");
    controls.forEach(c => c.disabled = true);

    const bars = document.getElementsByClassName("bar");

    if (selection === "bubble") await bubbleSort(bars);
    else if (selection === "insertion") await insertionSort(bars);
    else if (selection === "merge") await mergeSort(bars);
    else if (selection === "quick") {
        await quickSort(0, array.length - 1, bars);
        // Ensure all are green at the very end
        for (let bar of bars) bar.style.backgroundColor = "#10b981";
    }

    controls.forEach(c => c.disabled = false);
}



async function quickSort(left, right, bars) {
    if (left < right) {
        let pivotIndex = await partition(left, right, bars);
        await quickSort(left, pivotIndex - 1, bars);
        await quickSort(pivotIndex + 1, right, bars);
    }
}
async function partition(left, right, bars) {
    let pivot = array[right];
    
    // Clear any leftover colors from previous partitions in this range
    for(let k = left; k <= right; k++) {
        bars[k].style.backgroundColor = "#6366f1";
    }

    // 1. Highlight the pivot in BRIGHT RED immediately
    bars[right].style.backgroundColor = "#ff0000"; 
    
    // Force a small extra pause just to see the pivot selection
    await new Promise(resolve => setTimeout(resolve, 200)); 

    let i = left - 1;

    for (let j = left; j < right; j++) {
        // Highlight current scanning bar in YELLOW
        bars[j].style.backgroundColor = "#ffff00"; 
        
        await sleep();

        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            bars[i].style.height = `${array[i]}px`;
            bars[j].style.height = `${array[j]}px`;
            
            // Flash the swap in ORANGE
            bars[i].style.backgroundColor = "#ff8c00";
            await sleep();
            bars[i].style.backgroundColor = "#6366f1";
        }

        // Reset the scanning bar color unless it's the pivot
        if (j !== right) {
            bars[j].style.backgroundColor = "#6366f1";
        }
    }

    // Final swap of pivot
    [array[i + 1], array[right]] = [array[right], array[i + 1]];
    bars[i + 1].style.height = `${array[i + 1]}px`;
    bars[right].style.height = `${array[right]}px`;
    
    // Reset old pivot position
    bars[right].style.backgroundColor = "#6366f1";
    
    // Mark the NEW position as GREEN (Confirmed Sorted)
    bars[i + 1].style.backgroundColor = "#10b981"; 
    
    return i + 1;
}



// --- Other Algorithms (Maintained for Stability) ---

async function bubbleSort(bars) {
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            bars[j].style.backgroundColor = "#ef4444"; 
            bars[j+1].style.backgroundColor = "#ef4444";
            await sleep();
            if (array[j] > array[j+1]) {
                [array[j], array[j+1]] = [array[j+1], array[j]];
                bars[j].style.height = `${array[j]}px`;
                bars[j+1].style.height = `${array[j+1]}px`;
            }
            bars[j].style.backgroundColor = "#6366f1"; 
            bars[j+1].style.backgroundColor = "#6366f1";
        }
        bars[array.length - i - 1].style.backgroundColor = "#10b981"; 
    }
    bars[0].style.backgroundColor = "#10b981";
}

async function insertionSort(bars) {
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        bars[i].style.backgroundColor = "#ef4444";
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            bars[j + 1].style.height = `${array[j + 1]}px`;
            bars[j + 1].style.backgroundColor = "#f59e0b"; 
            j--;
            await sleep();
        }
        array[j + 1] = key;
        bars[j + 1].style.height = `${key}px`;
        for (let k = 0; k <= i; k++) bars[k].style.backgroundColor = "#10b981";
    }
}

async function mergeSort(bars) {
    await mSort(0, array.length - 1, bars);
    for (let bar of bars) bar.style.backgroundColor = "#10b981";
}

async function mSort(start, end, bars) {
    if (start >= end) return;
    let mid = Math.floor((start + end) / 2);
    await mSort(start, mid, bars);
    await mSort(mid + 1, end, bars);
    await merge(start, mid, end, bars);
}

async function merge(start, mid, end, bars) {
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

document.addEventListener("DOMContentLoaded", resetArray);
