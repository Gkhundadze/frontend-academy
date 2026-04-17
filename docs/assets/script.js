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

  // Initialize unified editor events (Copy, Run, Clear)
  initEditorEvents();

  // Initialize any demo interactions
  initDemoInteractions();
});

/**
 * Safely saves and restores the caret position inside a contentEditable node natively over DOM re-renders.
 */
function saveCaretPosition(context) {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return null;
  const range = selection.getRangeAt(0);
  const preCaretRange = range.cloneRange();
  preCaretRange.selectNodeContents(context);
  preCaretRange.setEnd(range.endContainer, range.endOffset);
  const caretOffset = preCaretRange.toString().length;

  return function restore() {
    let charIndex = 0;
    const range = document.createRange();
    range.setStart(context, 0);
    range.collapse(true);
    let nodeStack = [context], node, foundStart = false, stop = false;

    while (!stop && (node = nodeStack.pop())) {
      if (node.nodeType === 3) {
        let nextCharIndex = charIndex + node.length;
        if (!foundStart && caretOffset >= charIndex && caretOffset <= nextCharIndex) {
          range.setStart(node, caretOffset - charIndex);
          range.setEnd(node, caretOffset - charIndex);
          stop = true;
        }
        charIndex = nextCharIndex;
      } else {
        let i = node.childNodes.length;
        while (i--) { nodeStack.push(node.childNodes[i]); }
      }
    }
    selection.removeAllRanges();
    selection.addRange(range);
  };
}

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
  const codeBlocks = document.querySelectorAll("pre code");

  codeBlocks.forEach((codeBlock) => {
    const pre = codeBlock.parentElement;

    // Skip if already transformed or no parent
    if (!pre || pre.closest(".code-editor")) return;

    // Skip code blocks inside demo sections (they have special formatting)
    if (pre.closest(".demo-section")) return;

    // Get code content
    const codeText = codeBlock.textContent;

    // Skip empty code blocks
    if (!codeText || codeText.trim().length === 0) return;

    // Detect language from class name (e.g., language-javascript)
    const languageClass = codeBlock.className.match(/language-(\w+)/);
    const language = languageClass
      ? languageClass[1]
      : detectLanguage(codeText);

    // Get line count
    const lines = codeText.trim().split("\n");
    const lineCount = lines.length;

    // Create code editor wrapper
    const editorWrapper = document.createElement("div");
    editorWrapper.className = "code-editor";
    editorWrapper.dataset.language = language;

    // Create header with filename and controls
    const header = document.createElement("div");
    header.className = "code-editor-header";

    // Left side: dots and filename
    const headerLeft = document.createElement("div");
    headerLeft.style.display = "flex";
    headerLeft.style.alignItems = "center";
    headerLeft.style.gap = "1rem";

    // macOS-style dots
    const dots = document.createElement("div");
    dots.className = "code-editor-dots";
    dots.innerHTML = `
      <span class="code-editor-dot red"></span>
      <span class="code-editor-dot yellow"></span>
      <span class="code-editor-dot green"></span>
    `;

    // File title
    const title = document.createElement("div");
    title.className = "code-editor-title";
    title.innerHTML = `<span>📄</span> <span>${getFileName(language)}</span>`;

    headerLeft.appendChild(dots);
    headerLeft.appendChild(title);

    // Right side: copy button
    const actions = document.createElement("div");
    actions.className = "code-editor-actions";

    const copyBtn = document.createElement("button");
    copyBtn.className = "code-copy-btn";
    copyBtn.innerHTML = "📋 Copy";
    copyBtn.setAttribute("data-code", codeText);

    const runCode = document.createElement("button");
    runCode.className = "run-code-btn";
    runCode.innerHTML = "▶ Run";
    if (language !== "javascript" && language !== "html" && language !== "markup") {
      runCode.style.display = "none";
    }

    actions.appendChild(copyBtn);
    actions.appendChild(runCode);

    header.appendChild(headerLeft);
    header.appendChild(actions);

    // Create body with line numbers and code
    const body = document.createElement("div");
    body.className = "code-editor-body";

    const codeWithLines = document.createElement("div");
    codeWithLines.className = "code-with-lines";

    // Create line numbers container
    const lineNumbers = document.createElement("div");
    lineNumbers.className = "line-numbers";
    
    // Function to reliably update line numbers
    const updateLineNumbers = (text) => {
      const count = (text.match(/\n/g) || []).length + 1;
      lineNumbers.innerHTML = "";
      for (let i = 1; i <= count; i++) {
        const lineNum = document.createElement("span");
        lineNum.textContent = i;
        lineNumbers.appendChild(lineNum);
      }
    };
    updateLineNumbers(codeText);

    // Visual Engine: Direct plain environment
    const newPre = document.createElement("pre");
    newPre.className = `language-${language}`; // Explicit binding guaranteeing Prism DOM overlays
    const newCode = document.createElement("code");
    newCode.className = `language-${language}`;
    newCode.contentEditable = "true";
    newCode.spellcheck = false;

    // Apply keydown/paste overrides to ensure only pure text enters the environment
    newCode.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        document.execCommand('insertText', false, '\n');
      } else if (e.key === 'Tab') {
        e.preventDefault();
        document.execCommand('insertText', false, '  ');
      }
    });

    newCode.addEventListener('paste', function(e) {
      e.preventDefault();
      const text = (e.originalEvent || e).clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
    });

    // Update line numbers and force real-time Prism rendering natively
    newCode.addEventListener('input', function() {
      updateLineNumbers(this.textContent);
      
      const restoreCaret = saveCaretPosition(this);
      Prism.highlightElement(this);
      if (restoreCaret) restoreCaret();
    });

    // Initial highlight deployment
    newCode.textContent = codeText;
    Prism.highlightElement(newCode);

    newPre.appendChild(newCode);

    codeWithLines.appendChild(lineNumbers);
    codeWithLines.appendChild(newPre);

    body.appendChild(codeWithLines);

    // Create inline console
    const consoleDiv = document.createElement("div");
    consoleDiv.className = "inline-console";
    consoleDiv.style.display = "none";
    
    const consoleHeader = document.createElement("div");
    consoleHeader.className = "inline-console-header";
    const outputLabel = (language === "html" || language === "markup") ? "🖥️ HTML Preview" : "🖥️ Console Output";
    consoleHeader.innerHTML = `
      <span class="console-output-label">${outputLabel}</span>
      <button class="clear-console-btn" title="Clear Output">⊘ Clear</button>
    `;
    
    const consoleBody = document.createElement("div");
    consoleBody.className = "inline-console-body";
    
    const previewBody = document.createElement("div");
    previewBody.className = "inline-preview-body";
    previewBody.style.display = "none";
    
    consoleDiv.appendChild(consoleHeader);
    consoleDiv.appendChild(previewBody);
    consoleDiv.appendChild(consoleBody);

    // Assemble unified blocks
    editorWrapper.appendChild(header);
    editorWrapper.appendChild(body);
    editorWrapper.appendChild(consoleDiv);

    // Replace original layout injection
    const parent = pre.parentNode;
    if (parent) {
      parent.replaceChild(editorWrapper, pre);
    }
  });
}

/**
 * Consolidated Event Delegation for Editor Buttons (Copy, Run, Clear)
 */
function initEditorEvents() {
  if (document._editorEventsInitialized) return;
  document._editorEventsInitialized = true;

  document.addEventListener("click", function (e) {
    // 1. Copy Button
    const copyBtn = e.target.closest(".code-copy-btn");
    if (copyBtn) {
      const editor = copyBtn.closest(".code-editor");
      if (!editor) return;
      const codeElement = editor.querySelector("code");
      if (!codeElement) return;
      
      const code = codeElement.textContent; // Fetch raw plain text string directly
      navigator.clipboard.writeText(code).then(() => {
        copyBtn.innerHTML = "✓ Copied!";
        copyBtn.classList.add("copied");
        setTimeout(() => {
          copyBtn.innerHTML = "📋 Copy";
          copyBtn.classList.remove("copied");
        }, 2000);
      });
      return;
    }

    // 2. Run Button
    const runBtn = e.target.closest(".run-code-btn");
    if (runBtn) {
      const wrapper = runBtn.closest(".code-editor");
      if (!wrapper) return;
      
      const codeElement = wrapper.querySelector("code");
      const targetConsoleBody = wrapper.querySelector(".inline-console-body");
      const previewBody = wrapper.querySelector(".inline-preview-body");
      const consoleWrapper = wrapper.querySelector(".inline-console");
      const language = wrapper.dataset.language;

      if (consoleWrapper) consoleWrapper.style.display = "block";
      
      // Update output label dynamically based on language when running
      const outputLabelEl = consoleWrapper.querySelector(".console-output-label");

      // The 'Gold' Rule: Exclusively use innerText preventing metadata structural pollution natively
      const rawCode = codeElement.innerText; 

      if (language === "html" || language === "markup") {
        if (outputLabelEl) outputLabelEl.textContent = "🖥️ HTML Preview";
        targetConsoleBody.style.display = "none"; // Hide console for pure HTML preview
        previewBody.style.display = "block";
        executeCode("", targetConsoleBody, rawCode, previewBody, true);
      } else {
        if (outputLabelEl) outputLabelEl.textContent = "🖥️ Console Output";
        targetConsoleBody.style.display = "block";
        
        // Double-Sanitization: Aggressive cleanup ensuring pure code execution exactly as requested
        // (Added [a-z] after < to prevent destroying authentic JS math operators like `i < 10`)
        const cleanCode = rawCode.replace(/<\/?[a-z][^>]+(>|$)/gi, "");
        
        // Scan for DOM interactivity indicators to conditionally render visual iframe preview dynamically
        const needsDOM = /document\.|getElementById|querySelector|addEventListener|window\./i.test(cleanCode);
        
        let htmlContent = "";
        if (needsDOM) {
          // Locate the closest preceding HTML block dynamically without forcing strict filename bounds
          const allEditors = Array.from(document.querySelectorAll(".code-editor"));
          const currentIndex = allEditors.indexOf(wrapper);
          
          for (let i = currentIndex - 1; i >= 0; i--) {
            const checkLang = allEditors[i].dataset.language;
            if (checkLang === "html" || checkLang === "markup") {
              htmlContent = allEditors[i].querySelector("code").innerText;
              break;
            }
          }
          if (outputLabelEl) outputLabelEl.textContent = "🖥️ DOM Preview";
          previewBody.style.display = "block";
        }
        
        executeCode(cleanCode, targetConsoleBody, htmlContent, previewBody, needsDOM);
      }
      return;
    }

    // 3. Clear Console Button
    const clearBtn = e.target.closest(".clear-console-btn");
    if (clearBtn) {
      const wrapper = clearBtn.closest(".code-editor");
      if (!wrapper) return;
      const consoleBody = wrapper.querySelector(".inline-console-body");
      const previewBody = wrapper.querySelector(".inline-preview-body");
      const consoleWrapper = wrapper.querySelector(".inline-console");
      
      if (consoleBody) consoleBody.innerHTML = '';
      if (previewBody) {
        previewBody.innerHTML = '';
        previewBody.style.display = 'none';
      }
      if (consoleWrapper) consoleWrapper.style.display = 'none';
      return;
    }
  });
}

/**
 * Execute code in an isolated scope and output to a specific inline console
 * @param {string} codeText - The raw JavaScript code to execute
 * @param {HTMLElement} targetConsole - The target container for console output logs
 * @param {string} htmlContent - Optional HTML content to mount inside the iframe preview
 * @param {HTMLElement} previewBody - The target container for HTML preview rendering
 * @param {boolean} showPreview - Dictates whether the iframe sandbox should be visible in the UI
 */
function executeCode(codeText, targetConsole, htmlContent = "", previewBody = null, showPreview = false) {
  if (!targetConsole) return;
  
  // Clear the target console body before running
  targetConsole.innerHTML = "";
  if (previewBody) previewBody.innerHTML = "";

  const addToConsole = (data, type = "log") => {
    const line = document.createElement("div");
    line.className = `log-entry log-${type}`;

    if (typeof data === "object" && data !== null) {
      try {
        line.textContent = "❯ " + JSON.stringify(data, null, 2);
      } catch (e) {
        line.textContent = "❯ [Circular/Unserializable Object]";
      }
    } else {
      line.textContent = "❯ " + String(data);
    }
    targetConsole.appendChild(line);
    
    // Auto-scroll to the latest log
    targetConsole.scrollTop = targetConsole.scrollHeight;
  };

  try {
    // Custom Console Object intercepting standard methods
    const customConsole = {
      log: (...args) => addToConsole(args.length > 1 ? args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') : args[0], "log"),
      error: (...args) => addToConsole(args.length > 1 ? args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') : args[0], "error"),
      warn: (...args) => addToConsole(args.length > 1 ? args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') : args[0], "warn"),
    };

    // Always use the robust iframe execution sandbox to prevent 'Identifier already declared' via fresh environments
    if (previewBody) {
      previewBody.style.display = showPreview ? "block" : "none";
    }

    const iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.border = "none";
    iframe.style.background = "#ffffff";
    iframe.style.minHeight = showPreview ? "200px" : "0px";
    iframe.style.display = showPreview ? "block" : "none";
    iframe.sandbox = "allow-scripts allow-same-origin allow-modals allow-forms";

    if (previewBody) {
      previewBody.appendChild(iframe);
    } else {
      iframe.style.display = "none";
      document.body.appendChild(iframe);
    }

    const doc = iframe.contentWindow.document;
    doc.open();
    // Mount optional HTML component into authentic rendering pipeline
    doc.write(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      * { box-sizing: border-box; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        padding: 20px;
        margin: 0;
        color: #222;
        line-height: 1.6;
        background: #fff;
      }
      button {
        padding: 8px 16px;
        background: #4a90e2;
        color: #fff;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.2s;
      }
      button:hover { background: #357abd; }
      input, select, textarea {
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
        font-family: inherit;
      }
      h1,h2,h3,h4 { margin-top: 0; }
    </style>
  </head>
  <body>${htmlContent || ""}</body>
</html>`);
    doc.close();

    // Funnel console logs dynamically to parent unified tracker
    iframe.contentWindow._parentConsole = customConsole;
    const interceptor = doc.createElement("script");
    interceptor.textContent = `
      var console = {
        log: function() {
          var args = Array.prototype.slice.call(arguments);
          window._parentConsole.log.apply(null, args);
        },
        error: function() {
          var args = Array.prototype.slice.call(arguments);
          window._parentConsole.error.apply(null, args);
        },
        warn: function() {
          var args = Array.prototype.slice.call(arguments);
          window._parentConsole.warn.apply(null, args);
        }
      };
      window.onerror = function(msg, url, line) {
        window._parentConsole.error('❌ ' + msg + ' (line ' + line + ')');
        return true;
      };
    `;
    doc.head.appendChild(interceptor);

    // Spin up the executable string wrapped firmly in native block scope
    if (codeText && codeText.trim().length > 0) {
      const userScript = doc.createElement("script");
      userScript.textContent = `{\n${codeText}\n}`;
      doc.body.appendChild(userScript);
    }

    // Auto-resize iframe to fit content after render
    const resizeIframe = () => {
      if (doc && doc.body && showPreview) {
        const height = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);
        iframe.style.height = (height + 40) + "px";
      }
    };
    setTimeout(resizeIframe, 100);
    setTimeout(resizeIframe, 500); // second pass for dynamic content
  } catch (err) {
    addToConsole(err.message, "error");
  }
}

/**
 * Auto-detect programming language from code content
 * @param {string} code - The code to analyze
 * @returns {string} Detected language
 */
function detectLanguage(code) {
  // HTML: Look for HTML tags
  if (/<[a-z][\s\S]*>/i.test(code) && /<\/[a-z]+>/i.test(code)) {
    return "html";
  }

  // CSS: Look for CSS selectors and properties
  if (/[.#]?[\w-]+\s*\{[\s\S]*:[^;]+;/.test(code)) {
    return "css";
  }

  // JSON: Starts with { or [ and looks like JSON
  if (/^\s*[\[{]/.test(code) && /"[\w-]+":\s*/.test(code)) {
    return "json";
  }

  // Default to JavaScript for code-like content
  return "javascript";
}

/**
 * Get appropriate filename based on language
 * @param {string} language - Programming language
 * @returns {string} Filename
 */
function getFileName(language) {
  const fileNames = {
    javascript: "script.js",
    html: "index.html",
    css: "style.css",
    python: "main.py",
    java: "Main.java",
    cpp: "main.cpp",
    c: "main.c",
    php: "index.php",
    ruby: "script.rb",
    go: "main.go",
    rust: "main.rs",
    typescript: "script.ts",
    jsx: "Component.jsx",
    tsx: "Component.tsx",
    json: "data.json",
    xml: "data.xml",
    sql: "query.sql",
    bash: "script.sh",
    shell: "script.sh",
  };

  return fileNames[language] || "code.txt";
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
