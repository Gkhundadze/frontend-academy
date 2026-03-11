# Snake Game Project

A classic Snake game built with vanilla JavaScript and HTML5 Canvas. This project teaches fundamental game development concepts applicable to any interactive application.

## Learning Objectives

This project teaches:
- **Canvas API**: Drawing graphics with JavaScript
- **Game Loops**: Using setInterval for continuous updates
- **Keyboard Input**: Handling arrow key events
- **Collision Detection**: Checking for walls and self-collision
- **Array Manipulation**: Managing snake segments
- **Game State**: Tracking score, game status, and history
- **Object Coordinates**: Working with x/y positions

## Features

- Classic Snake gameplay
- Keyboard controls (arrow keys)
- Score tracking with high score persistence
- Pause/resume functionality
- Game over detection
- Responsive design
- Clean, modern UI

## How It Works

### Game Structure

```
Snake Array: [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}]
              ↑ Head          ↑ Body        ↑ Tail
```

The snake is an array of coordinate objects. Each move:
1. Add new head in the direction of movement
2. Remove tail (or keep it if food was eaten)

### Game Loop

```javascript
// Called every 100ms
function update() {
  moveSnake();        // Update positions
  checkCollision();   // Check for game over
  render();          // Draw everything
}

setInterval(update, 100); // 10 FPS
```

### Movement Logic

```javascript
// Current position
const head = { x: snake[0].x, y: snake[0].y };

// Add direction
head.x += dx; // dx = -1 (left), 0 (none), 1 (right)
head.y += dy; // dy = -1 (up), 0 (none), 1 (down)

// Add new head, remove tail
snake.unshift(head);
snake.pop();
```

### Collision Detection

```javascript
// Wall collision
if (head.x < 0 || head.x >= TILE_COUNT ||
    head.y < 0 || head.y >= TILE_COUNT) {
  gameOver();
}

// Self collision
for (let i = 1; i < snake.length; i++) {
  if (head.x === snake[i].x && head.y === snake[i].y) {
    gameOver();
  }
}
```

## Code Structure

```
snake-game/
├── index.html    # Game HTML structure
├── style.css     # UI styling
├── script.js     # Game logic
└── README.md     # This file
```

## Game Configuration

```javascript
const GRID_SIZE = 20;      // Size of each cell (pixels)
const CANVAS_SIZE = 400;   // Canvas dimensions (400x400)
const TILE_COUNT = 20;     // Grid is 20x20 cells
const GAME_SPEED = 100;    // 100ms between moves
```

## Controls

| Key | Action |
|-----|--------|
| ↑ | Move Up |
| ↓ | Move Down |
| ← | Move Left |
| → | Move Right |
| Space | Pause/Resume |

## Running the Project

1. Open `index.html` in your browser
2. Click "Start Game"
3. Use arrow keys to control the snake
4. Eat red food to grow and score points
5. Don't hit walls or yourself!

No build tools or dependencies required.

## Key Canvas Concepts

### Drawing Rectangles

```javascript
ctx.fillStyle = '#00ff00'; // Set color
ctx.fillRect(x, y, width, height); // Draw rectangle
```

### Drawing Circles

```javascript
ctx.beginPath();
ctx.arc(x, y, radius, 0, Math.PI * 2); // Full circle
ctx.fill();
```

### Clearing Canvas

```javascript
ctx.clearRect(0, 0, canvas.width, canvas.height);
// Or fill with background color
ctx.fillRect(0, 0, canvas.width, canvas.height);
```

## Game Loop Pattern

All games follow this pattern:

1. **Initialize**: Set up initial game state
2. **Input**: Handle user input (event listeners)
3. **Update**: Update game state (move objects, check collisions)
4. **Render**: Draw everything
5. **Repeat**: Go back to step 2

```
┌─────────┐
│ Update  │ ←┐
├─────────┤  │
│ Render  │  │
├─────────┤  │
│ Wait    │  │
└─────────┘  │
     └───────┘
```

## Extension Ideas

Want to practice more? Try adding:

1. **Difficulty Levels**: Increase speed as score increases
2. **Power-ups**: Special food that gives bonuses
3. **Obstacles**: Add walls in the playing field
4. **Multiple Food**: Multiple food items at once
5. **Snake AI**: Computer-controlled opponent
6. **Mobile Controls**: Touch/swipe controls
7. **Sound Effects**: Add audio feedback
8. **Leaderboard**: Track top scores
9. **Different Modes**: Wrap-around walls, different grid sizes
10. **Visual Effects**: Particle effects, screen shake

## Common Mistakes to Avoid

❌ **Allowing reverse direction**
```javascript
// BAD - Can reverse into yourself
if (event.code === 'ArrowUp') {
  dy = -1;
}
```

✅ **Check current direction**
```javascript
// GOOD - Can't reverse
if (event.code === 'ArrowUp' && dy === 0) {
  dy = -1;
}
```

❌ **Mutating state directly**
```javascript
// BAD - Modifies original
snake[0].x += dx;
```

✅ **Create new objects**
```javascript
// GOOD - Creates new head
const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
snake.unshift(newHead);
```

❌ **Forgetting to check collisions before move**
```javascript
// BAD - Move first, then check
moveSnake();
if (checkCollision()) gameOver();
```

✅ **Move, then check immediately**
```javascript
// GOOD - Check right after moving
moveSnake();
if (checkCollision()) {
  gameOver();
  return; // Stop processing
}
```

## Performance Tips

- Use `requestAnimationFrame` instead of `setInterval` for smoother animation
- Only redraw what changed (not necessary for this small game)
- Use canvas transforms instead of recalculating coordinates
- Cache canvas context references

## Browser Support

- Canvas API: All modern browsers
- Arrow key events: All browsers
- localStorage: IE 8+

## Resources

- [MDN: Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [MDN: setInterval](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)
- [MDN: KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)
- [Game Programming Patterns](https://gameprogrammingpatterns.com/)

## Code Comments

The `script.js` file includes extensive comments explaining:
- Every function's purpose
- Game loop mechanics
- Collision detection algorithms
- Array manipulation techniques
- Event handling patterns

Read them carefully - they contain valuable insights!

---

**Challenge**: Can you beat a score of 50? What about 100?
