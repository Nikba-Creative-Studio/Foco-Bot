// --- VARIABLES ---
let robotX = 0, robotY = 0;  // Position of the robot on the grid
let actionQueue = [];        // Queue of actions to execute
let currentLineIndex = 0;    // Index of the current action in the queue
let errorDisplayed = false;  // Flag to indicate if an error has been shown
let isExecuting = false;     // Flag to track if actions are being executed

// --- INITIALIZATION ---

// Creates a 15x15 grid and places the robot at the initial position
const createGrid = () => {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    Array.from({ length: 15 * 15 }, (_, i) => {
        const cell = document.createElement('div');
        cell.id = `cell-${Math.floor(i / 15)}-${i % 15}`;
        grid.appendChild(cell);
    });
    updateRobotPosition();
};

// Sets up the initial state of the grid and line numbers on page load
window.onload = () => {
    createGrid();
    updateLineNumbers();
    highlightActiveLine();
};

// --- UI UPDATES ---

// Updates the line numbers in the command queue editor to match the number of lines in the textarea
const updateLineNumbers = () => {
    const actionQueueTextarea = document.getElementById('actionQueueTextarea');
    const lineNumbers = document.getElementById('lineNumbers');
    const lines = actionQueueTextarea.value.split('\n').length;

    lineNumbers.innerHTML = '';
    Array.from({ length: lines }, (_, i) => {
        const line = document.createElement('div');
        line.textContent = i + 1;
        lineNumbers.appendChild(line);
    });

    highlightActiveLine();
};

// Highlights the currently active line in the textarea based on cursor position
const highlightActiveLine = () => {
    const actionQueueTextarea = document.getElementById('actionQueueTextarea');
    const lineNumbers = document.getElementById('lineNumbers');
    const currentLine = actionQueueTextarea.value
        .substring(0, actionQueueTextarea.selectionStart)
        .split('\n').length;

    Array.from(lineNumbers.children).forEach(line => line.classList.remove('active-line'));
    lineNumbers.children[currentLine - 1]?.classList.add('active-line');
};

// Syncs the scroll position between the line numbers and the textarea
const syncScroll = () => {
    document.getElementById('lineNumbers').scrollTop = document.getElementById('actionQueueTextarea').scrollTop;
};

// Highlights a specific line number to indicate which action is currently executing
const highlightExecutionLine = (lineIndex) => {
    const lineNumbers = document.getElementById('lineNumbers');
    Array.from(lineNumbers.children).forEach(line => line.classList.remove('active-line'));
    lineNumbers.children[lineIndex]?.classList.add('active-line');
};

// --- ROBOT CONTROL ---

// Updates the robot's position on the grid and colors the cell if the "color" action is executed
const updateRobotPosition = (color = false) => {
    document.querySelectorAll('.grid div').forEach(cell => cell.classList.remove('robot'));
    const currentCell = document.getElementById(`cell-${robotY}-${robotX}`);
    currentCell.classList.add('robot');
    
    // Color the current cell if color action is executed
    if (color) {
        currentCell.style.backgroundColor = '#fb6b25';
    } else {
        // Add trail effect - color the cell the robot passes through with violet gradient
        currentCell.style.background = 'linear-gradient(to bottom right, #8b5cf6 0, #a855f7)';
        currentCell.style.opacity = '0.8';
        currentCell.style.borderRadius = '50%';
    }
};

// Adds an action to the command queue in the textarea and updates line numbers
const addAction = (action) => {
    const actionQueueTextarea = document.getElementById('actionQueueTextarea');
    actionQueueTextarea.value += `${action}\n`;
    updateLineNumbers();
};

// --- EXECUTION CONTROL ---

// Starts the execution of actions in the queue if any actions are present
const startMovement = () => {
    const actionQueueTextarea = document.getElementById('actionQueueTextarea');
    
    // Always re-populate the actionQueue from the textarea on each start
    actionQueue = actionQueueTextarea.value.trim().split('\n');

    // Check if there are actions to execute
    if (!actionQueue.length || !actionQueue[0]) {
        showModal("No actions to execute! Please add actions first.", false);
        return;
    }

    errorDisplayed = false;
    isExecuting = true;
    currentLineIndex = 0; // Start from the first command
    executeNextAction();
};

// Executes the next action in the queue with a delay to allow smooth animation
const executeNextAction = () => {
    if (!isExecuting) return; // Stop execution if isExecuting is false

    if (currentLineIndex >= actionQueue.length) {
        if (isExecuting) { // Check if execution completed naturally
            showModal("Execution complete!", true);
        }
        currentLineIndex = 0;
        isExecuting = false;
        return;
    }

    requestAnimationFrame(() => {
        executeAction();
        if (!errorDisplayed && isExecuting) setTimeout(executeNextAction, 500);
    });
};

// Stops the execution of actions by setting isExecuting to false
const stopMovement = () => {
    isExecuting = false; // Set execution to false to stop further actions
};

// Resets the robot's position and clears any cell color, without clearing the command queue
const restartRobot = () => {
    document.querySelectorAll('.grid div').forEach(cell => {
        cell.style.backgroundColor = '';
        cell.style.background = '';
        cell.style.opacity = '';
        cell.style.borderRadius = '';
    }); // Reset all cell styles

    robotX = 0;
    robotY = 0;
    currentLineIndex = 0;  // Start from the first command in the queue

    updateRobotPosition();
    stopMovement();
};

// Resets the robot, clears the command queue and all cell colors, and resets line numbers
const resetRobot = () => {
    document.getElementById('actionQueueTextarea').value = ''; // Clear textarea
    actionQueue = []; // Clear the action queue
    robotX = robotY = currentLineIndex = 0;

    document.querySelectorAll('.grid div').forEach(cell => {
        cell.style.backgroundColor = '';
        cell.style.background = '';
        cell.style.opacity = '';
        cell.style.borderRadius = '';
    }); // Reset all cell styles
    updateRobotPosition();
    stopMovement();
    updateLineNumbers(); // Reset line numbers
};

// Executes the current action from the queue, updating the robot position and handling errors
const executeAction = () => {
    try {
        if (currentLineIndex >= actionQueue.length) {
            stopMovement();
            currentLineIndex = 0;
            showModal("Execution complete!", true);
            return;
        }

        const action = actionQueue[currentLineIndex].trim();
        highlightExecutionLine(currentLineIndex);

        switch (action) {
            case 'up': if (robotY > 0) robotY -= 1; else throw new Error("Robot is out of grid bounds!"); break;
            case 'down': if (robotY < 14) robotY += 1; else throw new Error("Robot is out of grid bounds!"); break;
            case 'left': if (robotX > 0) robotX -= 1; else throw new Error("Robot is out of grid bounds!"); break;
            case 'right': if (robotX < 14) robotX += 1; else throw new Error("Robot is out of grid bounds!"); break;
            case 'rotate': break; // Rotation logic can be added here
            case 'color': updateRobotPosition(true); break;
            default: throw new Error(`Unknown command: ${action}`);
        }

        updateRobotPosition();
        currentLineIndex++;

    } catch (error) {
        if (!errorDisplayed) {
            errorDisplayed = true;
            stopMovement();
            showModal(error.message, false);
        }
    }
};

// --- MODAL FUNCTION ---

// Displays a modal with a message and a close button; green if success, red if error
const showModal = (message, isSuccess = true) => {
    const overlay = document.createElement('div');
    overlay.classList.add('modal-overlay');

    const modal = document.createElement('div');
    modal.classList.add('modal');

    const messageParagraph = document.createElement('p');
    messageParagraph.textContent = message;

    const closeButton = document.createElement('button');
    closeButton.textContent = "Close";
    closeButton.classList.add(isSuccess ? 'success-button' : 'error-button');

    modal.append(messageParagraph, closeButton);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    closeButton.onclick = () => document.body.removeChild(overlay);
};

// --- EVENT LISTENERS ---

// Adds event listeners for interaction with the action queue textarea
document.getElementById('actionQueueTextarea').addEventListener('click', highlightActiveLine);
document.getElementById('actionQueueTextarea').addEventListener('keyup', highlightActiveLine);
document.getElementById('actionQueueTextarea').addEventListener('scroll', syncScroll);