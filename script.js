// Initialize variables for robot position and action queue
let robotX = 0, robotY = 0;
let actionQueue = [];
let moveInterval;

// Create the grid and add the robot
function createGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    for (let i = 0; i < 15 * 15; i++) {
        const cell = document.createElement('div');
        cell.id = `cell-${Math.floor(i / 15)}-${i % 15}`;
        grid.appendChild(cell);
    }
    // Place robot in the initial position
    updateRobotPosition();
}

// Add an action to the textarea queue
function addAction(action) {
    const actionQueueTextarea = document.getElementById('actionQueueTextarea');
    actionQueueTextarea.value += action + '\n'; // Append action to textarea
}

// Update robot's position on the grid and color cell if needed
function updateRobotPosition(color = false) {
    document.querySelectorAll('.grid div').forEach(cell => cell.classList.remove('robot'));

    const currentCell = document.getElementById(`cell-${robotY}-${robotX}`);
    currentCell.classList.add('robot');
    
    // If the color action is executed, color the cell black
    if (color) {
        currentCell.style.backgroundColor = '#fb6b25';
    }
}

// Start moving the robot based on the queued actions
function startMovement() {
    // Read commands from textarea and populate actionQueue array
    const actionQueueTextarea = document.getElementById('actionQueueTextarea');
    actionQueue = actionQueueTextarea.value.trim().split('\n'); // Split each line as an action

    if (actionQueue.length === 0 || actionQueue[0] === "") {
        alert("No actions to execute! Please add actions first.");
        return;
    }

    // Prevent multiple intervals from starting
    if (moveInterval) clearInterval(moveInterval);

    // Begin executing actions
    moveInterval = setInterval(executeAction, 500); // Move every 500ms
}

// Stop the robot's movement
function stopMovement() {
    clearInterval(moveInterval);
}

// Restart the robot without clearing the command queue
function restartRobot() {
    // Clear the color of all cells
    document.querySelectorAll('.grid div').forEach(cell => {
        cell.style.backgroundColor = ''; // Reset color to default
    });
    
    // Reset the robot position to the initial state
    robotX = robotY = 0;
    updateRobotPosition();
    stopMovement();
}

// Reset the robot to the initial state, clear colors, and clear command queue
function resetRobot() {
    document.getElementById('actionQueueTextarea').value = ''; // Clear textarea
    actionQueue = [];
    robotX = robotY = 0;

    // Clear the color of all cells
    document.querySelectorAll('.grid div').forEach(cell => {
        cell.style.backgroundColor = ''; // Reset color to default
    });

    updateRobotPosition();
    stopMovement();
}

// Execute each action in the queue sequentially
function executeAction() {
    if (actionQueue.length === 0) {
        stopMovement();
        return;
    }

    // Execute the first action in the queue
    const action = actionQueue.shift();

    switch (action.trim()) {
        case 'up': robotY = Math.max(0, robotY - 1); updateRobotPosition(); break;
        case 'down': robotY = Math.min(14, robotY + 1); updateRobotPosition(); break;
        case 'left': robotX = Math.max(0, robotX - 1); updateRobotPosition(); break;
        case 'right': robotX = Math.min(14, robotX + 1); updateRobotPosition(); break;
        case 'rotate': /* Rotation logic can be added here */ break;
        case 'color': updateRobotPosition(true); break;
        default: console.warn(`Unknown command: ${action}`);
    }
}

// Initialize the grid on load
window.onload = createGrid;
