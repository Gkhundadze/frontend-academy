# Dark Mode Toggle Project

A practical demonstration of implementing dark mode with theme persistence using localStorage.

## Learning Objectives

This project teaches:
- **DOM Manipulation**: Selecting and modifying elements
- **Event Handling**: Responding to button clicks
- **classList API**: Adding, removing, and toggling classes
- **localStorage**: Persisting user preferences across sessions
- **CSS Variables**: Creating themeable designs
- **Smooth Transitions**: Animating theme changes

## Features

- Toggle between light and dark themes
- Smooth color transitions
- Persistent theme preference (remembers your choice)
- Animated toggle button
- Responsive design
- Modern, clean UI

## How It Works

### 1. CSS Variables

We define color schemes using CSS custom properties:

```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #2c3e50;
  /* ... more colors */
}

body.dark-mode {
  --bg-primary: #1a1a1a;
  --text-primary: #e8e8e8;
  /* ... dark mode colors */
}
```

When the `dark-mode` class is added to `<body>`, all colors automatically update!

### 2. JavaScript Toggle

```javascript
// Toggle the dark-mode class
document.body.classList.toggle('dark-mode');

// Save preference to localStorage
localStorage.setItem('theme', 'dark');
```

### 3. Load Saved Preference

```javascript
// On page load, check saved preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark-mode');
}
```

## Code Structure

```
dark-mode/
├── index.html    # HTML structure
├── style.css     # Styles with CSS variables
├── script.js     # Toggle functionality
└── README.md     # This file
```

## Key Concepts

### classList API

- `.add('class')` - Adds a class
- `.remove('class')` - Removes a class
- `.toggle('class')` - Adds if absent, removes if present
- `.contains('class')` - Checks if class exists

### localStorage API

- `.setItem('key', 'value')` - Saves data
- `.getItem('key')` - Retrieves data
- `.removeItem('key')` - Deletes data

Data persists until manually cleared!

### CSS Custom Properties

- Define with `--variable-name: value;`
- Use with `var(--variable-name)`
- Can be changed via JavaScript
- Inherit down the DOM tree

## Running the Project

1. Open `index.html` in your browser
2. Click the toggle button in the header
3. Refresh the page - your preference is saved!

No build tools or server required.

## Extension Ideas

Want to practice more? Try adding:

1. **Multiple Themes**: Add blue, green, or other color schemes
2. **Keyboard Shortcut**: Toggle with `Ctrl+D` or similar
3. **System Preference Detection**: Auto-detect with `prefers-color-scheme`
4. **Settings Panel**: Allow customizing individual colors
5. **Animations**: Add more sophisticated transitions
6. **Theme Preview**: Show theme options before applying

## Common Mistakes to Avoid

❌ **Don't use inline styles**
```javascript
// BAD
document.body.style.backgroundColor = '#000';
```

✅ **Use classes and CSS**
```javascript
// GOOD
document.body.classList.toggle('dark-mode');
```

❌ **Don't forget to save preference**
```javascript
// BAD - Theme resets on reload
document.body.classList.toggle('dark-mode');
```

✅ **Save to localStorage**
```javascript
// GOOD - Theme persists
document.body.classList.toggle('dark-mode');
localStorage.setItem('theme', 'dark');
```

## Browser Support

- Chrome, Firefox, Safari, Edge (all modern versions)
- localStorage: IE 8+
- CSS Variables: IE 11+ (or use fallbacks)

## Resources

- [MDN: classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)
- [MDN: localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [MDN: CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Web.dev: Dark Mode](https://web.dev/prefers-color-scheme/)

---

**Challenge**: Can you implement this pattern in your own projects?
