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

// Add an action to the queue
function addAction(action) {
    actionQueue.push(action);
    const actionQueueList = document.getElementById('actionQueue');
    const actionItem = document.createElement('li');
    actionItem.textContent = action;
    actionQueueList.appendChild(actionItem);
}

// Update robot's position on the grid and color cell if needed
function updateRobotPosition(color = false) {
    document.querySelectorAll('.grid div').forEach(cell => cell.classList.remove('robot'));

    const currentCell = document.getElementById(`cell-${robotY}-${robotX}`);
    currentCell.classList.add('robot');
    
    // If the color action is executed, color the cell black
    if (color) {
        currentCell.style.backgroundColor = 'black';
    }
}

// Start moving the robot based on the queued actions
function startMovement() {
    if (moveInterval) clearInterval(moveInterval);
    moveInterval = setInterval(executeAction, 500); // Move every 500ms
}

// Stop the robot's movement
function stopMovement() {
    clearInterval(moveInterval);
}

// Reset the robot to the initial state
function resetRobot() {
    actionQueue = [];
    document.getElementById('actionQueue').innerHTML = '';
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

    const action = actionQueue.shift();
    document.getElementById('actionQueue').removeChild(document.getElementById('actionQueue').childNodes[0]);

    switch (action) {
        case 'up': robotY = Math.max(0, robotY - 1); break;
        case 'down': robotY = Math.min(14, robotY + 1); break;
        case 'left': robotX = Math.max(0, robotX - 1); break;
        case 'right': robotX = Math.min(14, robotX + 1); break;
        case 'rotate': /* Rotation logic can be added here */ break;
        case 'color': updateRobotPosition(true); break;
    }
    updateRobotPosition();
}

// Initialize the grid on load
window.onload = createGrid;
