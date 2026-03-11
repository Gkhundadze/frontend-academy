/*
  BOARD COMPONENT

  Renders the 3x3 grid of squares and handles square clicks.

  Props:
  - xIsNext: boolean indicating whose turn
  - squares: array of 9 values (X, O, or null)
  - onPlay: callback function to handle moves
*/

import Square from './Square';

/*
  calculateWinner - Determines if there's a winner
  @param {Array} squares - Array of 9 square values
  @returns {string|null} - 'X', 'O', or null if no winner
*/
function calculateWinner(squares) {
  // All possible winning lines (rows, columns, diagonals)
  const lines = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal \
    [2, 4, 6], // Diagonal /
  ];

  // Check each winning line
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    // If all three squares in a line have the same value (and not null)
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; // Return winner ('X' or 'O')
    }
  }

  // No winner found
  return null;
}

/*
  Board Component
  @param {Object} props - Component props
*/
export default function Board({ xIsNext, squares, onPlay }) {

  /*
    handleClick - Handles square click
    @param {number} i - Index of clicked square (0-8)
  */
  function handleClick(i) {
    // GUARD CLAUSES: Don't allow move if...

    // 1. Square is already filled
    if (squares[i]) {
      return;
    }

    // 2. Game is already won
    if (calculateWinner(squares)) {
      return;
    }

    // Create a copy of squares array
    // IMPORTANT: Never mutate state directly in React!
    // Always create a new array/object
    const nextSquares = squares.slice();

    // Set the clicked square to X or O
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }

    // Call parent's onPlay callback with new board state
    // This updates state in App component
    onPlay(nextSquares);
  }

  // ===================================
  // DETERMINE GAME STATUS
  // ===================================

  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    // Someone won
    status = `Winner: ${winner}`;
  } else if (squares.every(square => square !== null)) {
    // All squares filled, no winner (draw)
    status = "It's a draw!";
  } else {
    // Game in progress
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  // ===================================
  // RENDER
  // ===================================

  return (
    <>
      {/*
        Fragment <></> allows returning multiple elements
        without adding extra DOM nodes
      */}

      <div className={`status ${winner ? 'winner' : ''}`}>
        {status}
      </div>

      <div className="board">
        {/*
          Render 9 squares in a 3x3 grid.
          Each Square receives:
          - value: What to display (X, O, or null)
          - onSquareClick: Function to call when clicked
        */}

        {/* Row 1 */}
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />

        {/* Row 2 */}
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />

        {/* Row 3 */}
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

/*
  ALTERNATIVE: Rendering with loops

  Instead of hardcoding 9 squares, you could use loops:

  {[0, 1, 2].map(row => (
    <div key={row} className="board-row">
      {[0, 1, 2].map(col => {
        const index = row * 3 + col;
        return (
          <Square
            key={index}
            value={squares[index]}
            onSquareClick={() => handleClick(index)}
          />
        );
      })}
    </div>
  ))}

  This is more scalable for larger boards but less clear for beginners.
*/
