/*
  DARK MODE TOGGLE - JAVASCRIPT

  This script demonstrates:
  - DOM selection (getElementById)
  - Event listeners (click events)
  - classList manipulation (add, remove, toggle)
  - localStorage API (saving and retrieving data)
  - Conditional logic

  The goal is to toggle dark mode and remember the user's preference.
*/

// ===================================
// STEP 1: SELECT ELEMENTS
// ===================================

// Get the toggle button element by its ID
// getElementById returns the first element with the matching ID
const themeToggle = document.getElementById('themeToggle');

// ===================================
// STEP 2: CHECK FOR SAVED PREFERENCE
// ===================================

/*
  localStorage is a browser API that stores data permanently (until cleared).
  We check if the user previously selected dark mode.

  localStorage.getItem('key') retrieves a saved value.
  Returns null if the key doesn't exist.
*/

const savedTheme = localStorage.getItem('theme');

// If user previously chose dark mode, apply it immediately
if (savedTheme === 'dark') {
  // Add the 'dark-mode' class to body
  // This triggers the CSS variables defined for dark mode
  document.body.classList.add('dark-mode');
}

// ===================================
// STEP 3: ADD EVENT LISTENER
// ===================================

/*
  addEventListener attaches a function to an event.
  When the button is clicked, the function runs.

  Syntax: element.addEventListener('event', function)
*/

themeToggle.addEventListener('click', function() {

  // ===================================
  // STEP 4: TOGGLE THE CLASS
  // ===================================

  /*
    classList.toggle('class-name') does the following:
    - If the class exists, remove it
    - If the class doesn't exist, add it

    This is perfect for switching between two states!
  */

  document.body.classList.toggle('dark-mode');

  // ===================================
  // STEP 5: SAVE PREFERENCE
  // ===================================

  /*
    Check if dark mode is currently active after toggling.
    classList.contains('class-name') returns true if the class is present.
  */

  if (document.body.classList.contains('dark-mode')) {
    // Dark mode is now active
    // Save 'dark' to localStorage so it persists
    localStorage.setItem('theme', 'dark');

    // Optional: Log to console for debugging
    console.log('Dark mode activated');

  } else {
    // Light mode is now active
    // Save 'light' to localStorage
    localStorage.setItem('theme', 'light');

    console.log('Light mode activated');
  }

});

// ===================================
// BONUS: ALTERNATIVE APPROACH
// ===================================

/*
  Here's a more concise version using arrow functions and ternary operators.
  This does the exact same thing as above, just more compact.

  Uncomment this and comment out the above code to try it:
*/

/*
themeToggle.addEventListener('click', () => {
  // Toggle the class
  document.body.classList.toggle('dark-mode');

  // Save theme using ternary operator
  // condition ? valueIfTrue : valueIfFalse
  const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
  localStorage.setItem('theme', theme);

  console.log(`${theme} mode activated`);
});
*/

// ===================================
// EXPLANATION OF KEY CONCEPTS
// ===================================

/*
  1. classList API:
     - .add('class') - adds a class
     - .remove('class') - removes a class
     - .toggle('class') - adds if absent, removes if present
     - .contains('class') - returns true/false

  2. localStorage API:
     - .setItem('key', 'value') - saves data
     - .getItem('key') - retrieves data
     - .removeItem('key') - deletes data
     - Data persists until manually cleared

  3. Event Listeners:
     - Respond to user actions (click, keypress, scroll, etc.)
     - addEventListener('event', callback)
     - The callback function runs when the event occurs

  4. Why this pattern works:
     - CSS variables make theme switching easy (change one class, update all colors)
     - localStorage remembers preference across sessions
     - Toggle method simplifies switching between two states
     - Transition property in CSS makes the change smooth
*/

// ===================================
// COMMON MISTAKES TO AVOID
// ===================================

/*
  ❌ WRONG: Forgetting to save to localStorage
     Result: Theme resets on page reload

  ❌ WRONG: Checking localStorage on every click
     Result: Unnecessary operations, slower performance

  ❌ WRONG: Using inline styles instead of classes
     Result: Harder to maintain, no smooth transitions

  ✅ CORRECT: Toggle class, save preference, let CSS handle styling
*/

// ===================================
// EXTENSION IDEAS
// ===================================

/*
  Want to practice more? Try adding these features:

  1. Add a keyboard shortcut (e.g., Ctrl+D) to toggle dark mode
  2. Detect system preference using: window.matchMedia('(prefers-color-scheme: dark)')
  3. Add more themes (not just light/dark, but also blue, green, etc.)
  4. Animate the toggle button with CSS transforms
  5. Add a settings panel with multiple theme options
*/
