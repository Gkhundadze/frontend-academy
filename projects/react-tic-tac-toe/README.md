# React Tic Tac Toe Game

A classic Tic Tac Toe game built with React to demonstrate fundamental React concepts.

## Learning Objectives

This project teaches:
- **React Components**: Building reusable UI components
- **State Management**: Using `useState` hook
- **Props**: Passing data between components
- **Event Handling**: Responding to user clicks
- **Conditional Rendering**: Displaying winner or next player
- **Lists and Keys**: Rendering game history
- **Component Composition**: Breaking UI into logical pieces

## Project Structure

```
react-tic-tac-toe/
├── src/
│   ├── App.jsx          # Main game component
│   ├── Board.jsx        # Game board component
│   ├── Square.jsx       # Individual square component
│   ├── App.css          # Styles
│   └── main.jsx         # Entry point
├── index.html
├── package.json
└── README.md
```

## Setup Instructions

### 1. Create React App with Vite

```bash
npm create vite@latest react-tic-tac-toe -- --template react
cd react-tic-tac-toe
npm install
```

### 2. Replace Default Files

Replace the contents of `src/App.jsx`, `src/App.css`, etc. with the provided files.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Game Features

- **Two-player gameplay**: X and O take turns
- **Winner detection**: Highlights the winner
- **Game history**: View and jump to previous moves
- **Reset game**: Start a new game anytime
- **Responsive design**: Works on mobile and desktop

## React Concepts Explained

### Components

The game is divided into three main components:

1. **Square**: A single clickable square
2. **Board**: The 3x3 grid of squares
3. **App**: The main game logic and history

### State Management

We use `useState` to track:
- Current board state (array of 9 squares)
- Which player's turn it is (X or O)
- Game history (array of board states)
- Current move number

### Props

Data flows down from parent to child:
- App → Board → Square
- Each component receives only the data it needs

### Event Handling

Clicks are handled through callback functions:
1. Square receives onClick prop from Board
2. Board receives onPlay prop from App
3. Events bubble up, state updates flow down

## How to Build This Yourself

1. **Start Simple**: Build a static board with hardcoded values
2. **Add Interactivity**: Make squares clickable
3. **Add State**: Track which squares are filled
4. **Determine Winner**: Implement winner detection logic
5. **Add History**: Store game history for time travel
6. **Polish**: Add styling and extra features

## Extension Ideas

Want to practice more? Try adding:

- Highlight the winning line
- Display location (row, col) for each move in history
- Rewrite Board to use loops instead of hardcoding
- Add a toggle to sort moves ascending or descending
- When someone wins, highlight the three squares
- When no one wins, display a draw message
- Create an AI opponent

## Resources

- [React Documentation](https://react.dev/)
- [React Tutorial: Tic Tac Toe](https://react.dev/learn/tutorial-tic-tac-toe)
- [Thinking in React](https://react.dev/learn/thinking-in-react)
