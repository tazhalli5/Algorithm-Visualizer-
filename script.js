let array = [];
const container = document.getElementById("container");

const complexities = {
    bubble: { time: "O(n²)", space: "O(1)" },
    insertion: { time: "O(n²)", space: "O(1)" },
    merge: { time: "O(n log n)", space: "O(n)" }
};

// Helper: Dynamically gets the delay from slider
function sleep() {
    const ms = document.getElementById("speedDelay").value;
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateComplexityInfo() {
    const selection = document.getElementById("algoSelect").value;
    document.getElementById("time-complexity").innerText = complexities[selection].time;
    document.getElementById("space-complexity").innerText = complexities[selection].space;
}

function resetArray() {
    container.innerHTML = "";
    array = [];
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
    const selection = document.getElementById("algoSelect").value;
    if (!selection) return;

    const controls = document.querySelectorAll("button, select, input");
    controls.forEach(c => c.disabled = true);

    if (selection === "bubble") await bubbleSort();
    if (selection === "insertion") await insertionSort();
    if (selection === "merge") await mergeSort();

    controls.forEach(c => c.disabled = false);
}

// --- Algorithms ---

async function bubbleSort() {
    let bars = document.getElementsByClassName("bar");
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

async function insertionSort() {
    let bars = document.getElementsByClassName("bar");
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        bars[i].style.backgroundColor = "#ef4444";
        while (j >= 0 && array[j] > key) {
            array[j+1] = array[j];
            bars[j+1].style.height = `${array[j+1]}px`;
            bars[j].style.backgroundColor = "#f59e0b";
            j--;
            await sleep();
            for(let k=0; k<i; k++) bars[k].style.backgroundColor = "#10b981";
        }
        array[j+1] = key;
        bars[j+1].style.height = `${key}px`;
    }
    for(let b of bars) b.style.backgroundColor = "#10b981";
}

async function mergeSort() {
    await mSort(0, array.length - 1);
    let bars = document.getElementsByClassName("bar");
    for(let b of bars) b.style.backgroundColor = "#10b981";
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

resetArray();
