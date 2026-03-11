/*
  Frontend Course Documentation - Main JavaScript
  Handles navigation, mobile menu, and interactive features
*/

// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', function() {

  // Initialize dark mode (check saved preference and apply)
  initDarkMode();

  // Mobile menu toggle functionality
  initMobileMenu();

  // Highlight active page in navigation
  highlightActivePage();

  // Add smooth scroll behavior for anchor links
  initSmoothScroll();

  // Transform code blocks into code editor style
  initCodeEditor();

  // Add copy button to code blocks
  initCodeCopyButtons();

  // Initialize any demo interactions
  initDemoInteractions();
});

/**
 * Initialize dark mode toggle
 * Checks localStorage for saved theme preference and creates toggle button
 */
function initDarkMode() {
  // Check for saved theme preference or default to light mode
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Apply saved theme or user's system preference
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.body.classList.add('dark-mode');
  }

  // Create dark mode toggle button
  const themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle';
  themeToggle.setAttribute('aria-label', 'Toggle dark mode');

  // Set initial button text based on current theme
  updateToggleButton(themeToggle);

  // Add click event to toggle dark mode
  themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');

    // Save preference to localStorage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

    // Update button text
    updateToggleButton(themeToggle);
  });

  // Place toggle button in sidebar header (documentation pages) or hero section (dashboard)
  const sidebarHeader = document.querySelector('.sidebar-header');
  const heroSection = document.querySelector('.hero-section');

  if (sidebarHeader) {
    // Documentation pages - add to sidebar
    sidebarHeader.appendChild(themeToggle);
  } else if (heroSection) {
    // Dashboard page - add to hero section
    themeToggle.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      width: auto;
    `;
    heroSection.style.position = 'relative';
    heroSection.appendChild(themeToggle);
  }
}

/**
 * Update dark mode toggle button text
 * @param {HTMLElement} button - The toggle button element
 */
function updateToggleButton(button) {
  const isDarkMode = document.body.classList.contains('dark-mode');
  button.innerHTML = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
}

/**
 * Initialize mobile menu toggle
 * Creates hamburger button and handles sidebar visibility on mobile devices
 */
function initMobileMenu() {
  // Check if sidebar exists on the page
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  // Create mobile menu toggle button if it doesn't exist
  let menuToggle = document.querySelector('.mobile-menu-toggle');
  if (!menuToggle) {
    menuToggle = document.createElement('button');
    menuToggle.className = 'mobile-menu-toggle';
    menuToggle.innerHTML = '☰';
    menuToggle.setAttribute('aria-label', 'Toggle menu');
    document.body.prepend(menuToggle);
  }

  // Toggle sidebar visibility when button is clicked
  menuToggle.addEventListener('click', function() {
    sidebar.classList.toggle('active');

    // Update button text to show open/close state
    this.innerHTML = sidebar.classList.contains('active') ? '✕' : '☰';
  });

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', function(event) {
    const isClickInsideSidebar = sidebar.contains(event.target);
    const isClickOnToggle = menuToggle.contains(event.target);

    // If click is outside sidebar and not on toggle button, close sidebar
    if (!isClickInsideSidebar && !isClickOnToggle && sidebar.classList.contains('active')) {
      sidebar.classList.remove('active');
      menuToggle.innerHTML = '☰';
    }
  });
}

/**
 * Highlight the active page in the navigation menu
 * Adds 'active' class to the current page's navigation link
 */
function highlightActivePage() {
  const currentPage = window.location.pathname.split('/').pop();
  const navLinks = document.querySelectorAll('.nav-list a');

  navLinks.forEach(link => {
    // Get the link's href filename
    const linkPage = link.getAttribute('href');

    // If the link matches current page, add active class
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });
}

/**
 * Initialize smooth scrolling for anchor links
 * Provides smooth scroll behavior when clicking internal page anchors
 */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();

      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/**
 * Initialize code editor style for all code blocks
 * Transforms simple <pre><code> blocks into styled code editor with line numbers
 */
function initCodeEditor() {
  const codeBlocks = document.querySelectorAll('pre code');

  codeBlocks.forEach(codeBlock => {
    const pre = codeBlock.parentElement;

    // Skip if already transformed or no parent
    if (!pre || pre.closest('.code-editor')) return;

    // Skip code blocks inside demo sections (they have special formatting)
    if (pre.closest('.demo-section')) return;

    // Get code content
    const codeText = codeBlock.textContent;

    // Skip empty code blocks
    if (!codeText || codeText.trim().length === 0) return;

    // Detect language from class name (e.g., language-javascript)
    const languageClass = codeBlock.className.match(/language-(\w+)/);
    const language = languageClass ? languageClass[1] : detectLanguage(codeText);

    // Get line count
    const lines = codeText.trim().split('\n');
    const lineCount = lines.length;

    // Create code editor wrapper
    const editorWrapper = document.createElement('div');
    editorWrapper.className = 'code-editor';

    // Create header with filename and controls
    const header = document.createElement('div');
    header.className = 'code-editor-header';

    // Left side: dots and filename
    const headerLeft = document.createElement('div');
    headerLeft.style.display = 'flex';
    headerLeft.style.alignItems = 'center';
    headerLeft.style.gap = '1rem';

    // macOS-style dots
    const dots = document.createElement('div');
    dots.className = 'code-editor-dots';
    dots.innerHTML = `
      <span class="code-editor-dot red"></span>
      <span class="code-editor-dot yellow"></span>
      <span class="code-editor-dot green"></span>
    `;

    // File title
    const title = document.createElement('div');
    title.className = 'code-editor-title';
    title.innerHTML = `<span>📄</span> <span>${getFileName(language)}</span>`;

    headerLeft.appendChild(dots);
    headerLeft.appendChild(title);

    // Right side: copy button
    const actions = document.createElement('div');
    actions.className = 'code-editor-actions';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'code-copy-btn';
    copyBtn.innerHTML = '📋 Copy';
    copyBtn.setAttribute('data-code', codeText);

    actions.appendChild(copyBtn);

    header.appendChild(headerLeft);
    header.appendChild(actions);

    // Create body with line numbers and code
    const body = document.createElement('div');
    body.className = 'code-editor-body';

    const codeWithLines = document.createElement('div');
    codeWithLines.className = 'code-with-lines';

    // Create line numbers
    const lineNumbers = document.createElement('div');
    lineNumbers.className = 'line-numbers';
    for (let i = 1; i <= lineCount; i++) {
      const lineNum = document.createElement('span');
      lineNum.textContent = i;
      lineNumbers.appendChild(lineNum);
    }

    // Create new pre and code elements
    const newPre = document.createElement('pre');
    const newCode = document.createElement('code');
    newCode.className = `language-${language}`;

    // Check if code already has syntax highlighting (contains spans)
    const hasExistingHighlighting = codeBlock.querySelector('span.keyword, span.string, span.comment, span.function, span.number');

    if (hasExistingHighlighting) {
      // Preserve existing highlighting
      newCode.innerHTML = codeBlock.innerHTML;
    } else {
      // Will apply syntax highlighting later
      newCode.textContent = codeText;
    }

    newPre.appendChild(newCode);

    codeWithLines.appendChild(lineNumbers);
    codeWithLines.appendChild(newPre);

    body.appendChild(codeWithLines);

    // Assemble editor
    editorWrapper.appendChild(header);
    editorWrapper.appendChild(body);

    // Replace original pre element
    const parent = pre.parentNode;
    if (parent) {
      parent.replaceChild(editorWrapper, pre);

      // Apply syntax highlighting only if not already highlighted
      if (!hasExistingHighlighting) {
        highlightSyntax(newCode, language);
      }
    }
  });
}

/**
 * Add copy buttons functionality to code blocks
 */
function initCodeCopyButtons() {
  // Use event delegation on document, but check if already initialized
  if (document._codeCopyInitialized) return;
  document._codeCopyInitialized = true;

  document.addEventListener('click', function(e) {
    // Check if clicked element or parent is copy button
    const btn = e.target.closest('.code-copy-btn');
    if (!btn) return;

    // Get code from the code block
    const editor = btn.closest('.code-editor');
    if (!editor) return;

    const codeElement = editor.querySelector('code');
    if (!codeElement) return;

    const code = codeElement.textContent;

    // Copy to clipboard
    navigator.clipboard.writeText(code).then(() => {
      // Show success feedback
      const originalContent = btn.innerHTML;
      btn.innerHTML = '✓ Copied!';
      btn.classList.add('copied');

      // Reset after 2 seconds
      setTimeout(() => {
        btn.innerHTML = '📋 Copy';
        btn.classList.remove('copied');
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy code:', err);
      btn.innerHTML = '✗ Error';
      setTimeout(() => {
        btn.innerHTML = '📋 Copy';
      }, 2000);
    });
  });
}

/**
 * Auto-detect programming language from code content
 * @param {string} code - The code to analyze
 * @returns {string} Detected language
 */
function detectLanguage(code) {
  // HTML: Look for HTML tags
  if (/<[a-z][\s\S]*>/i.test(code) && /<\/[a-z]+>/i.test(code)) {
    return 'html';
  }

  // CSS: Look for CSS selectors and properties
  if (/[.#]?[\w-]+\s*\{[\s\S]*:[^;]+;/.test(code)) {
    return 'css';
  }

  // JSON: Starts with { or [ and looks like JSON
  if (/^\s*[\[{]/.test(code) && /"[\w-]+":\s*/.test(code)) {
    return 'json';
  }

  // Default to JavaScript for code-like content
  return 'javascript';
}

/**
 * Get appropriate filename based on language
 * @param {string} language - Programming language
 * @returns {string} Filename
 */
function getFileName(language) {
  const fileNames = {
    'javascript': 'script.js',
    'html': 'index.html',
    'css': 'style.css',
    'python': 'main.py',
    'java': 'Main.java',
    'cpp': 'main.cpp',
    'c': 'main.c',
    'php': 'index.php',
    'ruby': 'script.rb',
    'go': 'main.go',
    'rust': 'main.rs',
    'typescript': 'script.ts',
    'jsx': 'Component.jsx',
    'tsx': 'Component.tsx',
    'json': 'data.json',
    'xml': 'data.xml',
    'sql': 'query.sql',
    'bash': 'script.sh',
    'shell': 'script.sh'
  };

  return fileNames[language] || 'code.txt';
}

/**
 * Apply basic syntax highlighting to code
 * @param {HTMLElement} codeElement - The code element to highlight
 * @param {string} language - Programming language
 */
function highlightSyntax(codeElement, language) {
  const code = codeElement.textContent;
  let highlighted = '';

  // JavaScript/TypeScript highlighting
  if (language === 'javascript' || language === 'typescript' || language === 'jsx' || language === 'tsx') {
    highlighted = highlightJavaScript(code);
  }
  // HTML highlighting
  else if (language === 'html' || language === 'xml') {
    highlighted = highlightHTML(code);
  }
  // CSS highlighting
  else if (language === 'css') {
    highlighted = highlightCSS(code);
  }
  // JSON highlighting
  else if (language === 'json') {
    highlighted = highlightJSON(code);
  }
  // No highlighting for unknown languages
  else {
    highlighted = escapeHtml(code);
  }

  codeElement.innerHTML = highlighted;
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Highlight JavaScript code
 * @param {string} code - Code to highlight
 * @returns {string} Highlighted HTML
 */
function highlightJavaScript(code) {
  // Escape HTML first
  code = escapeHtml(code);

  // Comments (must come first to protect content)
  code = code.replace(/\/\*[\s\S]*?\*\//g, '<span class="token comment">$&</span>');
  code = code.replace(/\/\/.*$/gm, '<span class="token comment">$&</span>');

  // Strings (must come before keywords to protect content)
  code = code.replace(/(["'`])(?:(?=(\\?))\2.)*?\1/g, '<span class="token string">$&</span>');

  // Keywords (avoid matching inside spans)
  const keywords = 'const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|class|extends|import|export|from|default|async|await|yield|typeof|instanceof|delete|void|in|of';
  code = code.replace(new RegExp(`\\b(${keywords})\\b(?![^<]*>|[^<>]*<\\/)`, 'g'), '<span class="token keyword">$1</span>');

  // Numbers (avoid inside spans)
  code = code.replace(/\b(\d+\.?\d*)\b(?![^<]*>|[^<>]*<\/)/g, '<span class="token number">$1</span>');

  // Functions (avoid inside spans)
  code = code.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()(?![^<]*>|[^<>]*<\/)/g, '<span class="token function">$1</span>');

  return code;
}

/**
 * Highlight HTML code
 * @param {string} code - Code to highlight
 * @returns {string} Highlighted HTML
 */
function highlightHTML(code) {
  // Escape HTML first (textContent gives us actual < and >)
  code = escapeHtml(code);

  // Use placeholder tokens to avoid regex conflicts
  const COMMENT_PLACEHOLDER = '\x00COMMENT\x00';
  const TAG_PLACEHOLDER = '\x00TAG\x00';

  const placeholders = [];
  let placeholderIndex = 0;

  // Step 1: Extract and placeholder comments
  code = code.replace(/&lt;!--[\s\S]*?--&gt;/g, (match) => {
    placeholders[placeholderIndex] = '<span class="token comment">' + match + '</span>';
    return COMMENT_PLACEHOLDER + (placeholderIndex++) + COMMENT_PLACEHOLDER;
  });

  // Step 2: Highlight tags
  code = code.replace(/(&lt;\/?[a-zA-Z][a-zA-Z0-9-]*)/g, (match) => {
    placeholders[placeholderIndex] = '<span class="token tag">' + match + '</span>';
    return TAG_PLACEHOLDER + (placeholderIndex++) + TAG_PLACEHOLDER;
  });

  code = code.replace(/(\/?&gt;)/g, (match) => {
    placeholders[placeholderIndex] = '<span class="token tag">' + match + '</span>';
    return TAG_PLACEHOLDER + (placeholderIndex++) + TAG_PLACEHOLDER;
  });

  // Step 3: Highlight attributes (now safe, comments and tags are placeholders)
  code = code.replace(/\s([a-zA-Z-]+)=/g, ' <span class="token attr-name">$1</span>=');

  // Step 4: Highlight attribute values
  code = code.replace(/=(&quot;|")([^"&]*?)(\1)/g, '=<span class="token string">$1$2$3</span>');

  // Step 5: Restore placeholders
  code = code.replace(/\x00COMMENT\x00(\d+)\x00COMMENT\x00/g, (_, index) => placeholders[index]);
  code = code.replace(/\x00TAG\x00(\d+)\x00TAG\x00/g, (_, index) => placeholders[index]);

  return code;
}

/**
 * Highlight CSS code
 * @param {string} code - Code to highlight
 * @returns {string} Highlighted HTML
 */
function highlightCSS(code) {
  code = escapeHtml(code);

  // Comments first
  code = code.replace(/\/\*[\s\S]*?\*\//g, '<span class="token comment">$&</span>');

  // Selectors (at start of line or after })
  code = code.replace(/(^|\})\s*([.#]?[a-zA-Z0-9-_:, >+~[\]="'.]+)\s*(?=\{)(?![^<]*<\/)/gm, '$1 <span class="token tag">$2</span> ');

  // Properties (word followed by colon)
  code = code.replace(/([a-zA-Z-]+)\s*:(?![^<]*<\/)(?!\/\/|\/\*)/g, '<span class="token property">$1</span>:');

  // Values (after colon, before semicolon)
  code = code.replace(/:\s*([^;{]+);(?![^<]*<\/)/g, ': <span class="token string">$1</span>;');

  return code;
}

/**
 * Highlight JSON code
 * @param {string} code - Code to highlight
 * @returns {string} Highlighted HTML
 */
function highlightJSON(code) {
  code = escapeHtml(code);

  // Strings (keys and values)
  code = code.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, '<span class="token string">"$1"</span>');

  // Numbers
  code = code.replace(/\b(-?\d+\.?\d*)\b(?![^<]*>)/g, '<span class="token number">$1</span>');

  // Booleans and null
  code = code.replace(/\b(true|false|null)\b(?![^<]*>)/g, '<span class="token keyword">$1</span>');

  return code;
}

/**
 * Initialize interactive demo features
 * Handles any interactive elements in demo sections
 */
function initDemoInteractions() {
  // This function can be extended to handle specific demo interactions
  // For now, it ensures demo sections are properly initialized

  const demoSections = document.querySelectorAll('.demo-section');

  demoSections.forEach(demo => {
    // Add interactive class if it contains buttons or interactive elements
    const hasInteractive = demo.querySelector('button, input, select');
    if (hasInteractive) {
      demo.classList.add('interactive-demo');
    }
  });
}

/**
 * Utility function to create notification/toast messages
 * @param {string} message - The message to display
 * @param {string} type - Type of notification (success, error, info)
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 16px 24px;
    background-color: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
    color: white;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
