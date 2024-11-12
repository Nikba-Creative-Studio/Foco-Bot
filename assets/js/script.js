// Initialize variables for robot position, action queue, and execution state
let robotX = 0, robotY = 0;
let actionQueue = [];
let moveInterval;
let currentLineIndex = 0;

// --- INITIALIZATION ---

// Create the grid and add the robot in the initial position
function createGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    for (let i = 0; i < 15 * 15; i++) {
        const cell = document.createElement('div');
        cell.id = `cell-${Math.floor(i / 15)}-${i % 15}`;
        grid.appendChild(cell);
    }
    updateRobotPosition(); // Place robot in the initial position
}

// Initialize line numbers on page load
window.onload = function() {
    createGrid();
    updateLineNumbers();
    highlightActiveLine();
};

// --- UI UPDATES ---

// Update line numbers in the Command Queue editor
function updateLineNumbers() {
    const actionQueueTextarea = document.getElementById('actionQueueTextarea');
    const lineNumbers = document.getElementById('lineNumbers');
    
    const lineCount = actionQueueTextarea.value.split('\n').length;
    lineNumbers.innerHTML = '';

    // Create line numbers
    for (let i = 1; i <= lineCount; i++) {
        const lineNumber = document.createElement('div');
        lineNumber.textContent = i;
        lineNumbers.appendChild(lineNumber);
    }

    highlightActiveLine(); // Highlight the current line
}

// Highlight the active line based on cursor position
function highlightActiveLine() {
    const actionQueueTextarea = document.getElementById('actionQueueTextarea');
    const lineNumbers = document.getElementById('lineNumbers');

    const cursorPosition = actionQueueTextarea.selectionStart;
    const textBeforeCursor = actionQueueTextarea.value.substring(0, cursorPosition);
    const currentLineNumber = textBeforeCursor.split('\n').length;

    Array.from(lineNumbers.children).forEach(line => line.classList.remove('active-line'));

    const activeLine = lineNumbers.children[currentLineNumber - 1];
    if (activeLine) {
        activeLine.classList.add('active-line');
    }
}

// Sync scroll between line numbers and textarea
function syncScroll() {
    const actionQueueTextarea = document.getElementById('actionQueueTextarea');
    const lineNumbers = document.getElementById('lineNumbers');
    lineNumbers.scrollTop = actionQueueTextarea.scrollTop;
}

// Highlight the line being executed in the Command Queue
function highlightExecutionLine(lineIndex) {
    const lineNumbers = document.getElementById('lineNumbers');
    Array.from(lineNumbers.children).forEach(line => line.classList.remove('active-line'));

    const activeLine = lineNumbers.children[lineIndex];
    if (activeLine) {
        activeLine.classList.add('active-line');
    }
}

// --- ROBOT CONTROL ---

// Update robot's position on the grid and color cell if needed
function updateRobotPosition(color = false) {
    document.querySelectorAll('.grid div').forEach(cell => cell.classList.remove('robot'));

    const currentCell = document.getElementById(`cell-${robotY}-${robotX}`);
    currentCell.classList.add('robot');
    
    if (color) {
        currentCell.style.backgroundColor = '#fb6b25'; // Color cell if 'color' action is executed
    }
}

// Add an action to the textarea queue
function addAction(action) {
    const actionQueueTextarea = document.getElementById('actionQueueTextarea');
    actionQueueTextarea.value += action + '\n'; // Append action to textarea
    updateLineNumbers(); // Update line numbers to reflect new line
}

// --- EXECUTION CONTROL ---

// Start moving the robot based on the queued actions
function startMovement() {
    const actionQueueTextarea = document.getElementById('actionQueueTextarea');
    if (actionQueue.length === 0) {
        actionQueue = actionQueueTextarea.value.trim().split('\n');
    }

    if (actionQueue.length === 0 || actionQueue[0] === "") {
        alert("No actions to execute! Please add actions first.");
        return;
    }

    if (moveInterval) clearInterval(moveInterval);

    moveInterval = setInterval(executeAction, 500); // Move every 500ms
}

// Stop the robot's movement
function stopMovement() {
    clearInterval(moveInterval);
}

// Restart the robot without clearing the command queue
function restartRobot() {
    document.querySelectorAll('.grid div').forEach(cell => {
        cell.style.backgroundColor = ''; // Reset color of all cells
    });

    robotX = 0;
    robotY = 0;
    currentLineIndex = 0; // Restart from the first command in the queue

    updateRobotPosition();
    stopMovement();
}

// Reset the robot to the initial state, clear colors, and clear command queue
function resetRobot() {
    document.getElementById('actionQueueTextarea').value = ''; // Clear textarea
    actionQueue = [];
    robotX = robotY = 0;
    currentLineIndex = 0;

    document.querySelectorAll('.grid div').forEach(cell => {
        cell.style.backgroundColor = ''; // Reset color to default
    });

    updateRobotPosition();
    stopMovement();
    updateLineNumbers(); // Clear line numbers after reset
}

// Execute each action in the queue sequentially
function executeAction() {
    if (currentLineIndex >= actionQueue.length) {
        stopMovement();
        currentLineIndex = 0; // Reset the line index after execution
        return;
    }

    const action = actionQueue[currentLineIndex].trim();
    
    highlightExecutionLine(currentLineIndex);

    switch (action) {
        case 'up': robotY = Math.max(0, robotY - 1); updateRobotPosition(); break;
        case 'down': robotY = Math.min(14, robotY + 1); updateRobotPosition(); break;
        case 'left': robotX = Math.max(0, robotX - 1); updateRobotPosition(); break;
        case 'right': robotX = Math.min(14, robotX + 1); updateRobotPosition(); break;
        case 'rotate': /* Rotation logic can be added here */ break;
        case 'color': updateRobotPosition(true); break;
        default: console.warn(`Unknown command: ${action}`);
    }

    currentLineIndex++;
}

// --- EVENT LISTENERS ---

document.getElementById('actionQueueTextarea').addEventListener('click', highlightActiveLine);
document.getElementById('actionQueueTextarea').addEventListener('keyup', highlightActiveLine);
document.getElementById('actionQueueTextarea').addEventListener('scroll', syncScroll);
