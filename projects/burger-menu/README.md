# Burger Menu Project

A responsive hamburger menu that toggles mobile navigation with smooth animations.

## Learning Objectives

- DOM manipulation
- Event listeners (click events)
- CSS transitions and animations
- classList API (toggle, add, remove)
- Mobile-first responsive design
- CSS transforms

## Features

- Hamburger icon (☰) that animates to X when opened
- Slide-in/slide-out navigation menu
- Smooth transitions
- Closes when clicking outside
- Keyboard accessible (ESC key to close)

## Project Structure

```
burger-menu/
├── index.html    # HTML structure
├── style.css     # Styles and animations
├── script.js     # Menu toggle logic
└── README.md     # This file
```

## Implementation Steps

1. **HTML Structure**
   - Create hamburger button (3 lines)
   - Create navigation menu
   - Add overlay for click-outside detection

2. **CSS Styling**
   - Hide menu off-screen by default
   - Style hamburger icon
   - Add transitions for smooth animations
   - Animate hamburger to X transformation

3. **JavaScript Logic**
   - Toggle menu on button click
   - Animate hamburger icon
   - Close menu when clicking outside
   - Close menu on ESC key press

## Key Concepts

### CSS Classes Approach

```javascript
// Good: Use classes for state
menuButton.addEventListener('click', () => {
  nav.classList.toggle('active');
  button.classList.toggle('active');
});
```

### Smooth Transitions

```css
.nav {
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.nav.active {
  transform: translateX(0);
}
```

### Hamburger Animation

```css
/* Transform hamburger lines to X */
.line1.active {
  transform: rotate(45deg) translateY(10px);
}

.line2.active {
  opacity: 0;
}

.line3.active {
  transform: rotate(-45deg) translateY(-10px);
}
```

## Extension Ideas

- Add sub-menus with dropdowns
- Animate menu items staggered entrance
- Add scroll lock when menu is open
- Implement swipe gesture to close
- Add backdrop blur effect
- Make menu closeable by clicking menu items

## Resources

- [MDN: classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)
- [MDN: CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions)
- [MDN: CSS Transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
