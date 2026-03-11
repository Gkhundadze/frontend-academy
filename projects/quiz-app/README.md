# Quiz Application Project

An interactive quiz application with multiple-choice questions, scoring, and results.

## Learning Objectives

- Working with arrays of objects
- Dynamic DOM manipulation
- Event handling
- State management
- JSON data structures
- Progress tracking
- Conditional rendering

## Features

- Multiple-choice questions
- Progress indicator
- Question navigation
- Instant feedback on answers
- Score tracking
- Results page with breakdown
- Restart functionality
- Timer (optional)

## Project Structure

```
quiz-app/
├── index.html    # HTML structure
├── style.css     # Styles
├── script.js     # Quiz logic
├── questions.js  # Question data (optional separate file)
└── README.md     # This file
```

## Question Data Structure

```javascript
const questions = [
  {
    id: 1,
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "Hot Mail",
      "How To Make Lasagna",
      "Home Tool Markup Language"
    ],
    correctAnswer: 0, // Index of correct option
    explanation: "HTML stands for HyperText Markup Language..."
  },
  // More questions...
];
```

## Key Concepts

### Displaying Questions

```javascript
function displayQuestion(index) {
  const question = questions[index];

  questionElement.textContent = question.question;

  // Clear previous options
  optionsContainer.innerHTML = '';

  // Create option buttons
  question.options.forEach((option, i) => {
    const button = document.createElement('button');
    button.textContent = option;
    button.addEventListener('click', () => checkAnswer(i));
    optionsContainer.appendChild(button);
  });
}
```

### Checking Answers

```javascript
function checkAnswer(selectedIndex) {
  const question = questions[currentQuestion];

  if (selectedIndex === question.correctAnswer) {
    score++;
    showFeedback('correct');
  } else {
    showFeedback('incorrect');
  }

  // Move to next question after delay
  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      displayQuestion(currentQuestion);
    } else {
      showResults();
    }
  }, 1500);
}
```

### Progress Tracking

```javascript
function updateProgress() {
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  progressBar.style.width = progress + '%';
  questionNumber.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
}
```

### Results Display

```javascript
function showResults() {
  const percentage = (score / questions.length) * 100;

  resultsContainer.innerHTML = `
    <h2>Quiz Complete!</h2>
    <p>Your Score: ${score} / ${questions.length}</p>
    <p>Percentage: ${percentage.toFixed(1)}%</p>
    <p>${getGrade(percentage)}</p>
    <button onclick="restartQuiz()">Try Again</button>
  `;
}

function getGrade(percentage) {
  if (percentage >= 90) return '🌟 Excellent!';
  if (percentage >= 70) return '👍 Good job!';
  if (percentage >= 50) return '😊 Not bad!';
  return '📚 Keep practicing!';
}
```

## Implementation Steps

1. **Setup Question Data**
   - Create array of question objects
   - Include multiple choice options
   - Store correct answers

2. **Display Current Question**
   - Show question text
   - Render option buttons
   - Update progress indicator

3. **Handle Answer Selection**
   - Detect button click
   - Check if answer is correct
   - Update score
   - Show visual feedback

4. **Navigation**
   - Move to next question
   - Allow going back (optional)
   - Track progress

5. **Results Page**
   - Calculate final score
   - Display percentage
   - Show review of answers
   - Provide restart option

## Styling Tips

```css
/* Option button states */
.option {
  transition: all 0.3s;
}

.option.correct {
  background-color: #4caf50;
  color: white;
}

.option.incorrect {
  background-color: #f44336;
  color: white;
}

.option.disabled {
  pointer-events: none;
  opacity: 0.6;
}
```

## Extension Ideas

- Add timer for each question
- Implement difficulty levels
- Category selection
- Save scores to localStorage
- Leaderboard
- Fetch questions from API (OpenTDB, etc.)
- Add images to questions
- True/False questions
- Multiple correct answers
- Hint system
- Review incorrect answers at end
- Progress save/resume

## API Resources

Free quiz APIs:
- [Open Trivia Database](https://opentdb.com/)
- [jService (Jeopardy)](https://jservice.io/)
- [Trivia API](https://the-trivia-api.com/)

## Resources

- [MDN: Array Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [MDN: Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Open Trivia Database API](https://opentdb.com/api_config.php)
