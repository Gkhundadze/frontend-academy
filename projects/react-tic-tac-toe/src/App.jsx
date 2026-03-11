/*
  REACT TIC TAC TOE - MAIN APP COMPONENT

  This component manages the game state and renders the board.

  React Concepts:
  - useState hook: Manages component state
  - Component composition: App > Board > Square
  - Props: Passing data and functions to children
  - Event handling: Responding to square clicks
  - Conditional rendering: Showing winner or next player
*/

import { useState } from 'react';
import Board from './Board';
import './App.css';

/*
  Main App Component
  Manages game state, history, and overall game logic
*/
export default function App() {

  // ===================================
  // STATE MANAGEMENT
  // ===================================

  /*
    useState hook creates state variables.
    State persists between renders and triggers re-renders when changed.

    Syntax: const [value, setValue] = useState(initialValue);
  */

  // history: Array of game states (each state is an array of 9 squares)
  // Starts with one empty board
  const [history, setHistory] = useState([Array(9).fill(null)]);

  // currentMove: Which move we're viewing (for time travel feature)
  const [currentMove, setCurrentMove] = useState(0);

  // xIsNext: Boolean tracking whose turn it is
  // We can calculate this from currentMove instead of storing it
  const xIsNext = currentMove % 2 === 0;

  // currentSquares: The board state we're currently viewing
  const currentSquares = history[currentMove];

  // ===================================
  // EVENT HANDLERS
  // ===================================

  /*
    handlePlay - Called when a square is clicked
    @param {Array} nextSquares - The new board state after a move
  */
  function handlePlay(nextSquares) {
    // Create new history up to current move + new move
    // This "throws away" any future history if we're viewing a past move
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];

    // Update state
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  /*
    jumpTo - Time travel to a specific move
    @param {number} nextMove - The move number to jump to
  */
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  /*
    resetGame - Resets the game to initial state
  */
  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  // ===================================
  // RENDER HISTORY MOVES
  // ===================================

  /*
    Create a button for each move in history.
    Clicking a button lets you "time travel" to that move.
  */
  const moves = history.map((squares, move) => {
    // Description for each move
    let description;
    if (move > 0) {
      description = `Go to move #${move}`;
    } else {
      description = 'Go to game start';
    }

    return (
      /*
        KEY PROP:
        React needs a unique "key" for each item in a list.
        Keys help React identify which items changed, added, or removed.
        Use stable IDs - here we use the move number.
      */
      <li key={move}>
        <button onClick={() => jumpTo(move)} className="history-button">
          {description}
        </button>
      </li>
    );
  });

  // ===================================
  // RENDER
  // ===================================

  /*
    JSX (JavaScript XML) looks like HTML but is actually JavaScript.
    Differences from HTML:
    - className instead of class
    - camelCase for attributes (onClick not onclick)
    - Can embed JavaScript expressions with {}
  */

  return (
    <div className="game">
      <div className="game-info">
        <h1>⭕ Tic Tac Toe ❌</h1>
      </div>

      <div className="game-board">
        {/*
          Pass props to Board component:
          - xIsNext: boolean for whose turn it is
          - squares: current board state
          - onPlay: callback function for handling moves
        */}
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
        />
      </div>

      <div className="game-history">
        <h3>Game History</h3>
        <button onClick={resetGame} className="reset-button">
          New Game
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

/*
  COMPONENT STRUCTURE EXPLANATION:

  App (parent)
  ↓ props: xIsNext, squares, onPlay
  Board (child)
  ↓ props: value, onSquareClick
  Square (grandchild)

  DATA FLOW:
  1. State lives in App (top level)
  2. State is passed down as props
  3. Events bubble up through callbacks
  4. State updates trigger re-renders

  This is called "lifting state up" - keeping state in
  the lowest common ancestor of all components that need it.
*/
