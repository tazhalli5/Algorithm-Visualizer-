body {
    background-color: #1a1a1a;
    color: white;
    font-family: Arial, sans-serif;
    text-align: center;
}

#container {
    display: flex;
    justify-content: center;
    align-items: flex-end; /* Bars sit on the bottom */
    height: 300px;
    margin: 50px auto;
    gap: 2px;
}

.bar {
    width: 20px;
    background-color: #3498db;
    transition: 0.1s; /* Smooth movement */
}

.controls button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    background: #2ecc71;
    border: none;
    color: white;
    border-radius: 5px;
    margin: 5px;
}

button:disabled {
    background: #7f8c8d;
    cursor: not-allowed;
}
