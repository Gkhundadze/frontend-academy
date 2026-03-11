# Memory Game Project

A classic card-matching memory game built with JavaScript.

## Learning Objectives

- Array manipulation and shuffling
- Event delegation
- Game state management
- Timers (setTimeout, setInterval)
- CSS animations
- Local storage for high scores

## Game Rules

1. Click cards to flip them
2. Match two cards with the same image/value
3. If they match, cards stay face-up
4. If they don't match, they flip back
5. Match all pairs to win
6. Track moves and time

## Features

- Randomized card positions each game
- Flip animations
- Match detection
- Scoring system (moves and time)
- Win detection and celebration
- High score tracking
- Restart game functionality

## Project Structure

```
memory-game/
├── index.html    # HTML structure
├── style.css     # Styles and animations
├── script.js     # Game logic
└── README.md     # This file
```

## Key Concepts

### Card Array

```javascript
const cards = [
  '🍎', '🍎',
  '🍌', '🍌',
  '🍇', '🍇',
  '🍊', '🍊'
];
```

### Shuffling Algorithm (Fisher-Yates)

```javascript
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
```

### Game State

```javascript
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;
let moves = 0;
```

### Match Detection

```javascript
function checkMatch() {
  if (firstCard.dataset.value === secondCard.dataset.value) {
    // Match!
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    resetCards();
  } else {
    // No match - flip back after delay
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetCards();
    }, 1000);
  }
}
```

## Implementation Steps

1. Create grid of cards (HTML)
2. Style cards with CSS (front/back)
3. Shuffle cards on game start
4. Implement flip animation
5. Add click event listeners
6. Track selected cards
7. Check for matches
8. Implement win condition
9. Add timer and move counter
10. Save high score

## CSS Card Flip

```css
.card {
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card.flipped {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  position: absolute;
  backface-visibility: hidden;
}

.card-back {
  transform: rotateY(180deg);
}
```

## Extension Ideas

- Different difficulty levels (more cards)
- Themes (animals, flags, emojis)
- Multiplayer mode (take turns)
- Sound effects
- Hint system
- Leaderboard
- Different grid sizes
- Timer-based challenges

## Resources

- [MDN: Array Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [CSS 3D Transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
- [Fisher-Yates Shuffle Algorithm](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
