/*
  SQUARE COMPONENT

  A single clickable square in the Tic Tac Toe board.
  This is a "presentational" or "dumb" component -
  it just displays what it's told and calls callbacks when clicked.

  Props:
  - value: The value to display (X, O, or null)
  - onSquareClick: Function to call when clicked
*/

export default function Square({ value, onSquareClick }) {
  /*
    This is a simple functional component.
    It receives props and returns JSX.

    Notice:
    - No state management (no useState)
    - No complex logic
    - Just presentation and event handling

    This makes it easy to test, reuse, and understand.
  */

  return (
    <button
      className="square"
      onClick={onSquareClick}
    >
      {/*
        Display the value (X, O, or nothing)
        In JSX, {expression} embeds JavaScript
      */}
      {value}
    </button>
  );
}

/*
  COMPONENT BEST PRACTICES:

  1. Keep components small and focused
     ✅ Square only handles displaying and clicking one square

  2. Make components reusable
     ✅ Square can be used in any board game

  3. Separate presentation from logic
     ✅ Square doesn't know about game rules, just displays and clicks

  4. Use descriptive prop names
     ✅ "value" and "onSquareClick" are clear

  5. Avoid inline styles when possible
     ✅ Uses className instead of inline styles
*/

/*
  PROPS VS STATE:

  Props:
  - Passed from parent to child
  - Read-only (immutable)
  - Used to configure a component

  State:
  - Managed within a component
  - Can be changed (with setState)
  - Triggers re-renders when changed

  Square uses PROPS because:
  - It doesn't need to remember anything
  - Its value comes from the parent (Board)
  - It just displays what it's told
*/
