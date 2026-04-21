/*
  SNAKE GAME - JAVASCRIPT

  This game teaches:
  - Canvas API for drawing graphics
  - Game loops using setInterval
  - Keyboard event handling
  - Collision detection algorithms
  - Array manipulation for game state
  - Object-oriented game structure

  Game Logic:
  1. Snake is an array of {x, y} coordinates
  2. Snake moves by adding new head and removing tail
  3. Eating food adds to score and grows snake (don't remove tail)
  4. Game ends if snake hits wall or itself
*/

// ===================================
// CANVAS SETUP
// ===================================

// Get the canvas element and its 2D drawing context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
// ctx (context) is the object we use to draw on canvas

// Game configuration
const GRID_SIZE = 20; // Size of each grid cell in pixels
const CANVAS_SIZE = 400; // Canvas is 400x400 pixels
const TILE_COUNT = CANVAS_SIZE / GRID_SIZE; // 20x20 grid

// ===================================
// GAME STATE VARIABLES
// ===================================

// Snake is an array of segments (objects with x and y coordinates)
// Each segment is one grid cell
let snake = [
  { x: 10, y: 10 } // Starting position: center of grid
];

// Direction the snake is moving
let dx = 0; // Change in x (-1 = left, 1 = right, 0 = not moving)
let dy = 0; // Change in y (-1 = up, 1 = down, 0 = not moving)

// Food position
let food = {
  x: 15,
  y: 15
};

// Game status
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameLoop = null; // Will store setInterval ID
let isPaused = false;
let gameStarted = false;
let changingDirection = false;

// Speed (milliseconds between moves)
const GAME_SPEED = 100; // Snake moves every 100ms (10 times per second)

// ===================================
// DOM ELEMENTS
// ===================================

const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');

// Display initial high score
highScoreElement.textContent = highScore;

// ===================================
// DRAWING FUNCTIONS
// ===================================

/*
  clearCanvas - Clears the entire canvas
  Called at the start of each frame to redraw everything
*/
function clearCanvas() {
  // fillStyle sets the color for drawing
  ctx.fillStyle = '#000'; // Black background

  // fillRect(x, y, width, height) draws a filled rectangle
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

/*
  drawSnake - Draws all segments of the snake
*/
function drawSnake() {
  // Set snake color
  ctx.fillStyle = '#00ff00'; // Bright green

  // Loop through each segment and draw it
  snake.forEach((segment, index) => {
    // Draw segment
    ctx.fillRect(
      segment.x * GRID_SIZE, // Convert grid position to pixels
      segment.y * GRID_SIZE,
      GRID_SIZE - 2, // Slightly smaller than grid (leaves gap)
      GRID_SIZE - 2
    );

    // Draw snake head differently (lighter color)
    if (index === 0) {
      ctx.fillStyle = '#00ff88'; // Head is lighter green
      ctx.fillRect(
        segment.x * GRID_SIZE + 4,
        segment.y * GRID_SIZE + 4,
        GRID_SIZE - 10,
        GRID_SIZE - 10
      );
      ctx.fillStyle = '#00ff00'; // Reset for body segments
    }
  });
}

/*
  drawFood - Draws the food
*/
function drawFood() {
  ctx.fillStyle = '#ff0000'; // Red

  // Draw food as a circle
  ctx.beginPath();
  ctx.arc(
    food.x * GRID_SIZE + GRID_SIZE / 2, // Center of grid cell
    food.y * GRID_SIZE + GRID_SIZE / 2,
    GRID_SIZE / 2 - 2, // Radius
    0, // Start angle
    Math.PI * 2 // End angle (full circle)
  );
  ctx.fill();
}

/*
  drawGrid - Draws grid lines (optional, for visual reference)
*/
function drawGrid() {
  ctx.strokeStyle = '#111'; // Dark gray
  ctx.lineWidth = 0.5;

  // Vertical lines
  for (let i = 0; i <= TILE_COUNT; i++) {
    ctx.beginPath();
    ctx.moveTo(i * GRID_SIZE, 0);
    ctx.lineTo(i * GRID_SIZE, CANVAS_SIZE);
    ctx.stroke();
  }

  // Horizontal lines
  for (let i = 0; i <= TILE_COUNT; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * GRID_SIZE);
    ctx.lineTo(CANVAS_SIZE, i * GRID_SIZE);
    ctx.stroke();
  }
}

// ===================================
// GAME LOGIC
// ===================================

/*
  moveSnake - Moves the snake in the current direction
*/
function moveSnake() {
  // Create new head position based on current direction
  const head = {
    x: snake[0].x + dx,
    y: snake[0].y + dy
  };

  // Add new head to front of snake array
  // unshift() adds element to beginning of array
  snake.unshift(head);

  // Check if snake ate food
  if (head.x === food.x && head.y === food.y) {
    // Increase score
    score++;
    scoreElement.textContent = score;

    // Update high score if beaten
    if (score > highScore) {
      highScore = score;
      highScoreElement.textContent = highScore;
      localStorage.setItem('snakeHighScore', highScore);
    }

    // Generate new food position
    generateFood();

    // DON'T remove tail - snake grows!
  } else {
    // Remove tail (last segment)
    // pop() removes and returns last element of array
    snake.pop();
  }
}

/*
  generateFood - Creates food at random position
  Ensures food doesn't spawn on snake
*/
function generateFood() {
  let newFood;
  let foodOnSnake = true;

  // Keep generating until food is not on snake
  while (foodOnSnake) {
    newFood = {
      x: Math.floor(Math.random() * TILE_COUNT),
      y: Math.floor(Math.random() * TILE_COUNT)
    };

    // Check if food position overlaps any snake segment
    foodOnSnake = snake.some(segment =>
      segment.x === newFood.x && segment.y === newFood.y
    );
  }

  food = newFood;
}

/*
  checkCollision - Detects if snake hit wall or itself
  Returns true if collision detected
*/
function checkCollision() {
  const head = snake[0];

  // Check wall collision
  if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
    return true;
  }

  // Check self collision
  // Start from index 1 to skip head (can't collide with itself)
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  return false;
}

/*
  gameOver - Ends the game
*/
function gameOver() {
  // Stop the game loop
  clearInterval(gameLoop);
  gameLoop = null;
  gameStarted = false;

  // Show game over screen
  finalScoreElement.textContent = score;
  gameOverScreen.classList.remove('hidden');

  // Reset button states
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

/*
  update - Main game update function
  Called every frame by setInterval
*/
function update() {
  // Skip if paused
  if (isPaused) return;

  changingDirection = false;

  // Move snake
  moveSnake();

  // Check for collisions
  if (checkCollision()) {
    gameOver();
    return;
  }

  // Render the game
  render();
}

/*
  render - Draws everything on canvas
*/
function render() {
  clearCanvas();
  drawGrid();
  drawFood();
  drawSnake();
}

// ===================================
// GAME CONTROLS
// ===================================

/*
  startGame - Initializes and starts the game
*/
function startGame() {
  // Reset game state
  snake = [{ x: 10, y: 10 }];
  dx = 1; // Start moving right
  dy = 0;
  score = 0;
  scoreElement.textContent = score;
  isPaused = false;
  gameStarted = true;
  changingDirection = false;

  // Generate initial food
  generateFood();

  // Clear any existing game loop
  if (gameLoop) clearInterval(gameLoop);

  // Start game loop
  // setInterval calls update() every GAME_SPEED milliseconds
  gameLoop = setInterval(update, GAME_SPEED);

  // Update buttons
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  gameOverScreen.classList.add('hidden');

  // Initial render
  render();
}

/*
  pauseGame - Pauses/resumes the game
*/
function pauseGame() {
  if (!gameStarted) return;

  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
}

/*
  resetGame - Resets the game
*/
function resetGame() {
  // Stop game loop
  if (gameLoop) {
    clearInterval(gameLoop);
    gameLoop = null;
  }

  // Reset state
  snake = [{ x: 10, y: 10 }];
  dx = 0;
  dy = 0;
  score = 0;
  scoreElement.textContent = score;
  isPaused = false;
  gameStarted = false;
  changingDirection = false;

  // Reset buttons
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  pauseBtn.textContent = 'Pause';
  gameOverScreen.classList.add('hidden');

  // Render initial state
  generateFood();
  render();
}

// ===================================
// EVENT LISTENERS
// ===================================

// Button controls
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
resetBtn.addEventListener('click', resetGame);
restartBtn.addEventListener('click', startGame);

/*
  Keyboard controls
  Arrow keys change direction
*/
document.addEventListener('keydown', (event) => {
  // Prevent default scrolling behavior for arrow keys
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) {
    event.preventDefault();
  }

  // Space bar toggles pause
  if (event.code === 'Space') {
    pauseGame();
    return;
  }

  // Only change direction if game is running
  if (!gameStarted || isPaused || changingDirection) return;

  changingDirection = true;

  switch (event.code) {
    case 'ArrowUp':
      // Can't reverse direction (go up if already going down)
      if (dy === 0) {
        dx = 0;
        dy = -1;
      }
      break;

    case 'ArrowDown':
      if (dy === 0) {
        dx = 0;
        dy = 1;
      }
      break;

    case 'ArrowLeft':
      if (dx === 0) {
        dx = -1;
        dy = 0;
      }
      break;

    case 'ArrowRight':
      if (dx === 0) {
        dx = 1;
        dy = 0;
      }
      break;
  }
});

// ===================================
// INITIALIZE GAME
// ===================================

// Draw initial state when page loads
generateFood();
render();

/*
  GAME LOOP EXPLANATION:

  A game loop consists of three phases:
  1. INPUT: Handle user input (arrow keys)
  2. UPDATE: Update game state (move snake, check collisions)
  3. RENDER: Draw everything on canvas

  We use setInterval to call update() repeatedly.
  Inside update(), we handle both UPDATE and RENDER phases.
  INPUT is handled by event listeners.

  This pattern is used in all games!
*/
