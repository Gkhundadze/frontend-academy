/*
  Quiz App - JavaScript
  Demonstrates: Arrays, Objects, DOM Manipulation, Event Handling, Timers
*/

// ===========================================
// Quiz Data - Array of question objects
// ===========================================

const quizQuestions = [
  {
    question: "What does 'DOM' stand for in JavaScript?",
    options: [
      "Document Object Model",
      "Data Object Model",
      "Digital Orientation Method",
      "Document Oriented Mechanism"
    ],
    correctAnswer: 0
  },
  {
    question: "Which keyword is used to declare a constant in JavaScript?",
    options: ["var", "let", "const", "constant"],
    correctAnswer: 2
  },
  {
    question: "What is the output of: console.log(typeof [])?",
    options: ["array", "object", "undefined", "list"],
    correctAnswer: 1
  },
  {
    question: "Which method adds an element to the end of an array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    correctAnswer: 0
  },
  {
    question: "What does the '===' operator do?",
    options: [
      "Assigns a value",
      "Compares values only",
      "Compares values and types",
      "Checks if not equal"
    ],
    correctAnswer: 2
  },
  {
    question: "Which of these is NOT a JavaScript data type?",
    options: ["String", "Boolean", "Float", "Number"],
    correctAnswer: 2
  },
  {
    question: "What method is used to remove the last element from an array?",
    options: ["pop()", "push()", "shift()", "splice()"],
    correctAnswer: 0
  },
  {
    question: "Which company developed JavaScript?",
    options: ["Microsoft", "Netscape", "Oracle", "Google"],
    correctAnswer: 1
  },
  {
    question: "What is the correct way to write a JavaScript array?",
    options: [
      "var colors = (1:'red', 2:'green')",
      "var colors = 'red', 'green'",
      "var colors = ['red', 'green']",
      "var colors = {red, green}"
    ],
    correctAnswer: 2
  },
  {
    question: "How do you create a function in JavaScript?",
    options: [
      "function myFunction()",
      "function:myFunction()",
      "create myFunction()",
      "def myFunction()"
    ],
    correctAnswer: 0
  }
];

// ===========================================
// State Management - Quiz state object
// ===========================================

const quizState = {
  currentQuestionIndex: 0,
  score: 0,
  answers: [],  // Store user's answers
  timeLeft: 20,
  timerInterval: null,
  questions: [...quizQuestions] // Copy of questions (can shuffle later)
};

// ===========================================
// DOM Elements - Cache all DOM references
// ===========================================

const elements = {
  // Screens
  startScreen: document.getElementById('startScreen'),
  quizScreen: document.getElementById('quizScreen'),
  resultsScreen: document.getElementById('resultsScreen'),
  reviewScreen: document.getElementById('reviewScreen'),

  // Start screen
  startBtn: document.getElementById('startBtn'),
  totalQuestions: document.getElementById('totalQuestions'),

  // Quiz screen
  currentQuestion: document.getElementById('currentQuestion'),
  totalQuestionsQuiz: document.getElementById('totalQuestionsQuiz'),
  progressFill: document.getElementById('progressFill'),
  timerRing: document.getElementById('timerRing'),
  timerText: document.getElementById('timerText'),
  questionText: document.getElementById('questionText'),
  optionsContainer: document.getElementById('optionsContainer'),
  skipBtn: document.getElementById('skipBtn'),
  nextBtn: document.getElementById('nextBtn'),

  // Results screen
  resultsIcon: document.getElementById('resultsIcon'),
  resultsTitle: document.getElementById('resultsTitle'),
  scorePercentage: document.getElementById('scorePercentage'),
  scoreCircle: document.getElementById('scoreCircle'),
  correctAnswers: document.getElementById('correctAnswers'),
  wrongAnswers: document.getElementById('wrongAnswers'),
  skippedAnswers: document.getElementById('skippedAnswers'),
  resultsMessage: document.getElementById('resultsMessage'),
  reviewBtn: document.getElementById('reviewBtn'),
  restartBtn: document.getElementById('restartBtn'),

  // Review screen
  reviewContainer: document.getElementById('reviewContainer'),
  backToResultsBtn: document.getElementById('backToResultsBtn')
};

// ===========================================
// Initialization
// ===========================================

function init() {
  // Set up event listeners
  elements.startBtn.addEventListener('click', startQuiz);
  elements.skipBtn.addEventListener('click', skipQuestion);
  elements.nextBtn.addEventListener('click', nextQuestion);
  elements.restartBtn.addEventListener('click', restartQuiz);
  elements.reviewBtn.addEventListener('click', showReview);
  elements.backToResultsBtn.addEventListener('click', showResults);

  // Display total questions on start screen
  elements.totalQuestions.textContent = quizQuestions.length;
  elements.totalQuestionsQuiz.textContent = quizQuestions.length;
}

// ===========================================
// Quiz Flow Functions
// ===========================================

function startQuiz() {
  // Reset state
  quizState.currentQuestionIndex = 0;
  quizState.score = 0;
  quizState.answers = [];

  // Optional: Shuffle questions for variety
  // shuffleArray(quizState.questions);

  // Show quiz screen
  showScreen('quiz');

  // Load first question
  loadQuestion();
}

function loadQuestion() {
  const question = quizState.questions[quizState.currentQuestionIndex];

  // Update question number and progress
  elements.currentQuestion.textContent = quizState.currentQuestionIndex + 1;
  updateProgressBar();

  // Display question text
  elements.questionText.textContent = question.question;

  // Clear previous options
  elements.optionsContainer.innerHTML = '';

  // Create option buttons
  question.options.forEach((option, index) => {
    const optionElement = document.createElement('div');
    optionElement.className = 'option';
    optionElement.textContent = option;
    optionElement.addEventListener('click', () => selectOption(index));
    elements.optionsContainer.appendChild(optionElement);
  });

  // Reset and start timer
  resetTimer();
  startTimer();

  // Disable next button until answer is selected
  elements.nextBtn.disabled = true;
}

function selectOption(selectedIndex) {
  const question = quizState.questions[quizState.currentQuestionIndex];
  const options = elements.optionsContainer.querySelectorAll('.option');

  // Stop timer when answer is selected
  stopTimer();

  // Disable all options
  options.forEach((option) => option.classList.add('disabled'));

  // Highlight selected option
  options[selectedIndex].classList.add('selected');

  // Store the answer
  quizState.answers[quizState.currentQuestionIndex] = {
    selected: selectedIndex,
    correct: question.correctAnswer,
    isCorrect: selectedIndex === question.correctAnswer,
    skipped: false
  };

  // Show correct/incorrect feedback
  setTimeout(() => {
    options[selectedIndex].classList.remove('selected');

    if (selectedIndex === question.correctAnswer) {
      // Correct answer
      options[selectedIndex].classList.add('correct');
      quizState.score++;
      // Optional: Play success sound
    } else {
      // Incorrect answer
      options[selectedIndex].classList.add('incorrect');
      options[question.correctAnswer].classList.add('correct');
      // Shake animation for wrong answer
      options[selectedIndex].classList.add('shake');
    }

    // Enable next button
    elements.nextBtn.disabled = false;
  }, 300);
}

function skipQuestion() {
  // Stop timer
  stopTimer();

  // Store as skipped
  quizState.answers[quizState.currentQuestionIndex] = {
    selected: null,
    correct: quizState.questions[quizState.currentQuestionIndex].correctAnswer,
    isCorrect: false,
    skipped: true
  };

  // Move to next question or show results
  nextQuestion();
}

function nextQuestion() {
  quizState.currentQuestionIndex++;

  // Check if quiz is complete
  if (quizState.currentQuestionIndex >= quizState.questions.length) {
    showResults();
  } else {
    loadQuestion();
  }
}

// ===========================================
// Timer Functions
// ===========================================

function startTimer() {
  quizState.timeLeft = 20;
  updateTimerDisplay();

  quizState.timerInterval = setInterval(() => {
    quizState.timeLeft--;
    updateTimerDisplay();

    // Warning at 5 seconds
    if (quizState.timeLeft <= 5) {
      elements.timerText.classList.add('timer-warning');
      elements.timerRing.classList.add('timer-warning');
    }

    // Time's up
    if (quizState.timeLeft <= 0) {
      stopTimer();
      skipQuestion();
    }
  }, 1000);
}

function stopTimer() {
  if (quizState.timerInterval) {
    clearInterval(quizState.timerInterval);
    quizState.timerInterval = null;
  }
}

function resetTimer() {
  stopTimer();
  quizState.timeLeft = 20;
  elements.timerText.classList.remove('timer-warning');
  elements.timerRing.classList.remove('timer-warning');
}

function updateTimerDisplay() {
  // Update text
  elements.timerText.textContent = quizState.timeLeft;

  // Update circular progress
  const circumference = 2 * Math.PI * 26; // radius = 26
  const progress = (quizState.timeLeft / 20) * circumference;

  elements.timerRing.style.strokeDasharray = circumference;
  elements.timerRing.style.strokeDashoffset = circumference - progress;
}

// ===========================================
// Progress Bar
// ===========================================

function updateProgressBar() {
  const progress = ((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100;
  elements.progressFill.style.width = progress + '%';
}

// ===========================================
// Results Functions
// ===========================================

function showResults() {
  // Stop any running timer
  stopTimer();

  // Calculate statistics
  const totalQuestions = quizState.questions.length;
  const correct = quizState.answers.filter((a) => a.isCorrect).length;
  const wrong = quizState.answers.filter((a) => !a.isCorrect && !a.skipped).length;
  const skipped = quizState.answers.filter((a) => a.skipped).length;
  const percentage = Math.round((correct / totalQuestions) * 100);

  // Update results display
  elements.scorePercentage.textContent = percentage + '%';
  elements.correctAnswers.textContent = correct;
  elements.wrongAnswers.textContent = wrong;
  elements.skippedAnswers.textContent = skipped;

  // Animate score circle
  animateScoreCircle(percentage);

  // Set results message based on score
  let message, icon;
  if (percentage >= 90) {
    message = "Excellent! You're a JavaScript master! 🌟";
    icon = "🏆";
    elements.resultsTitle.textContent = "Outstanding!";
  } else if (percentage >= 70) {
    message = "Great job! Keep up the good work! 👏";
    icon = "🎉";
    elements.resultsTitle.textContent = "Well Done!";
  } else if (percentage >= 50) {
    message = "Good effort! Review the topics and try again! 📚";
    icon = "👍";
    elements.resultsTitle.textContent = "Good Try!";
  } else {
    message = "Keep learning! Practice makes perfect! 💪";
    icon = "📖";
    elements.resultsTitle.textContent = "Keep Practicing!";
  }

  elements.resultsMessage.textContent = message;
  elements.resultsIcon.textContent = icon;

  // Show results screen
  showScreen('results');
}

function animateScoreCircle(percentage) {
  const circumference = 2 * Math.PI * 90; // radius = 90
  const progress = (percentage / 100) * circumference;

  elements.scoreCircle.style.strokeDasharray = circumference;
  elements.scoreCircle.style.strokeDashoffset = circumference;

  // Animate the circle
  setTimeout(() => {
    elements.scoreCircle.style.strokeDashoffset = circumference - progress;
  }, 100);

  // Change color based on score
  if (percentage >= 70) {
    elements.scoreCircle.style.stroke = '#4caf50'; // Green
    elements.scorePercentage.style.color = '#4caf50';
  } else if (percentage >= 50) {
    elements.scoreCircle.style.stroke = '#ff9800'; // Orange
    elements.scorePercentage.style.color = '#ff9800';
  } else {
    elements.scoreCircle.style.stroke = '#f44336'; // Red
    elements.scorePercentage.style.color = '#f44336';
  }
}

// ===========================================
// Review Functions
// ===========================================

function showReview() {
  // Clear previous review
  elements.reviewContainer.innerHTML = '';

  // Create review items for each question
  quizState.questions.forEach((question, index) => {
    const answer = quizState.answers[index];
    const reviewItem = createReviewItem(question, answer, index);
    elements.reviewContainer.appendChild(reviewItem);
  });

  // Show review screen
  showScreen('review');
}

function createReviewItem(question, answer, index) {
  const div = document.createElement('div');
  div.className = 'review-item';

  // Determine status
  let status, statusClass;
  if (answer.skipped) {
    status = 'SKIPPED';
    statusClass = 'skipped';
  } else if (answer.isCorrect) {
    status = 'CORRECT';
    statusClass = 'correct';
  } else {
    status = 'INCORRECT';
    statusClass = 'incorrect';
  }

  div.classList.add(statusClass);

  // Build HTML
  div.innerHTML = `
    <div class="review-status ${statusClass}">${status}</div>
    <div class="review-question">
      <span class="review-number">Q${index + 1}</span>
      ${question.question}
    </div>
    <div class="review-answer">
      ${answer.skipped ?
        `<span class="review-label">Skipped</span>` :
        `<span class="review-label">Your Answer:</span>
         <span class="review-your-answer">${question.options[answer.selected]}</span>`
      }
    </div>
    <div class="review-answer">
      <span class="review-label">Correct Answer:</span>
      <span class="review-correct-answer">${question.options[answer.correct]}</span>
    </div>
  `;

  return div;
}

// ===========================================
// Screen Management
// ===========================================

function showScreen(screenName) {
  // Hide all screens
  elements.startScreen.classList.remove('active');
  elements.quizScreen.classList.remove('active');
  elements.resultsScreen.classList.remove('active');
  elements.reviewScreen.classList.remove('active');

  // Show requested screen
  switch(screenName) {
    case 'start':
      elements.startScreen.classList.add('active');
      break;
    case 'quiz':
      elements.quizScreen.classList.add('active');
      break;
    case 'results':
      elements.resultsScreen.classList.add('active');
      break;
    case 'review':
      elements.reviewScreen.classList.add('active');
      break;
  }
}

function restartQuiz() {
  // Reset everything and start over
  showScreen('start');
}

// ===========================================
// Utility Functions
// ===========================================

// Fisher-Yates shuffle algorithm (optional - for randomizing questions)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// ===========================================
// Initialize App on Page Load
// ===========================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', init);

/*
  Teaching Notes:

  1. State Management:
     - All quiz state is stored in a single object
     - Easy to track and debug

  2. DOM Caching:
     - All DOM elements are cached at the start
     - Improves performance

  3. Event Handling:
     - Events are set up once in init()
     - Uses event delegation where appropriate

  4. Timers:
     - setInterval for countdown
     - Always clear intervals to prevent memory leaks

  5. Array Methods:
     - filter() to calculate statistics
     - forEach() to iterate through questions
     - map() could be used for transforming data

  6. Animations:
     - CSS classes for visual feedback
     - setTimeout for delayed animations
     - SVG circles for progress indicators

  7. Modularity:
     - Each function has a single responsibility
     - Easy to understand and maintain
*/
