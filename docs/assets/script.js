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

  // Close sidebar when a nav link inside it is clicked (mobile UX)
  sidebar.addEventListener('click', function(event) {
    const link = event.target.closest('a');
    if (link && sidebar.classList.contains('active')) {
      sidebar.classList.remove('active');
      menuToggle.innerHTML = '☰';
    }
  });

  // Close sidebar when clicking outside on mobile — but only when the
  // sidebar is actually open, so we don't run this handler on every
  // desktop click for no reason.
  document.addEventListener('click', function(event) {
    if (!sidebar.classList.contains('active')) return;

    const isClickInsideSidebar = sidebar.contains(event.target);
    const isClickOnToggle = menuToggle.contains(event.target);

    if (!isClickInsideSidebar && !isClickOnToggle) {
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

    // Visual Engine: Textarea Overlay
    const editorContainer = document.createElement("div");
    editorContainer.style.position = "relative";
    editorContainer.style.flexGrow = "1";
    editorContainer.style.display = "flex";

    const textarea = document.createElement("textarea");
    textarea.className = "code-editor-textarea";
    textarea.value = codeText;
    textarea.spellcheck = false;
    textarea.style.position = "absolute";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.width = "100%";
    textarea.style.height = "100%";
    textarea.style.background = "transparent";
    textarea.style.color = "transparent";
    textarea.style.caretColor = "#f8f8f2"; // Default Okaidia text color
    textarea.style.border = "none";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.margin = "0";
    textarea.style.padding = "1em"; // Match Prism padding
    textarea.style.fontFamily = "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace";
    textarea.style.fontSize = "1em";
    textarea.style.lineHeight = "1.5";
    textarea.style.overflow = "auto";
    textarea.style.whiteSpace = "pre";
    textarea.style.zIndex = "1";
    textarea.style.tabSize = "4"; // Match Prism default

    const newPre = document.createElement("pre");
    newPre.className = `language-${language}`;
    newPre.style.margin = "0";
    newPre.style.width = "100%";
    newPre.style.height = "100%";
    newPre.style.pointerEvents = "none"; // Let clicks pass to textarea
    newPre.style.overflow = "hidden"; // Scroll is handled by textarea if needed

    const newCode = document.createElement("code");
    newCode.className = `language-${language}`;

    // Apply keydown override for Tab
    textarea.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.selectionStart;
        const end = this.selectionEnd;
        this.value = this.value.substring(0, start) + "  " + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 2;
        this.dispatchEvent(new Event('input'));
      }
    });

    // Sync input to code block
    textarea.addEventListener('input', function() {
      newCode.textContent = this.value;
      Prism.highlightElement(newCode);
      updateLineNumbers(this.value);
    });

    // Sync scroll
    textarea.addEventListener('scroll', function() {
      newPre.scrollTop = this.scrollTop;
      newPre.scrollLeft = this.scrollLeft;
    });

    // Initial highlight deployment
    newCode.textContent = codeText;
    Prism.highlightElement(newCode);

    newPre.appendChild(newCode);
    editorContainer.appendChild(newPre);
    editorContainer.appendChild(textarea);

    codeWithLines.appendChild(lineNumbers);
    codeWithLines.appendChild(editorContainer);

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

      const showCopied = () => {
        copyBtn.innerHTML = "✓ Copied!";
        copyBtn.classList.add("copied");
        setTimeout(() => {
          copyBtn.innerHTML = "📋 Copy";
          copyBtn.classList.remove("copied");
        }, 2000);
      };

      const showFailed = () => {
        copyBtn.innerHTML = "⚠ Failed";
        setTimeout(() => { copyBtn.innerHTML = "📋 Copy"; }, 2000);
      };

      // Prefer modern Clipboard API, but it requires a secure context
      // (HTTPS or localhost). On file:// or http://, fall back to a
      // textarea + execCommand('copy') trick.
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(code).then(showCopied).catch(() => {
          fallbackCopy(code) ? showCopied() : showFailed();
        });
      } else {
        fallbackCopy(code) ? showCopied() : showFailed();
      }
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

      // The 'Gold' Rule: Exclusively use textarea.value or textContent preventing metadata structural pollution natively
      const textarea = wrapper.querySelector("textarea");
      const rawCode = textarea ? textarea.value : codeElement.textContent; 

      if (language === "html" || language === "markup") {
        if (outputLabelEl) outputLabelEl.textContent = "🖥️ HTML Preview";
        targetConsoleBody.style.display = "none"; // Hide console for pure HTML preview
        previewBody.style.display = "block";
        executeCode("", targetConsoleBody, rawCode, previewBody, true);
      } else {
        if (outputLabelEl) outputLabelEl.textContent = "🖥️ Console Output";
        targetConsoleBody.style.display = "block";

        // Run the user's JS as-is. The iframe sandbox is isolation enough —
        // we must NOT strip "HTML-like" substrings because they are valid JS:
        // JSX, template literals ( `<div>${x}</div>` ), and strings like
        // str.split("<div>") all legitimately contain '<tag>' patterns.
        const cleanCode = rawCode;

        // Scan for DOM interactivity indicators to conditionally render visual iframe preview dynamically
        const needsDOM = /document\.|getElementById|querySelector|addEventListener|window\.|canvas|ctx/i.test(cleanCode);
        
        let htmlContent = "";
        if (needsDOM) {
          // Locate the closest preceding HTML block dynamically without forcing strict filename bounds
          const allEditors = Array.from(document.querySelectorAll(".code-editor"));
          const currentIndex = allEditors.indexOf(wrapper);
          
          for (let i = currentIndex - 1; i >= 0; i--) {
            const checkLang = allEditors[i].dataset.language;
            if (checkLang === "html" || checkLang === "markup") {
              const htmlTextarea = allEditors[i].querySelector("textarea");
              htmlContent = htmlTextarea ? htmlTextarea.value : allEditors[i].querySelector("code").textContent;
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
  <body>${htmlContent || `
    <div id="loading" style="display:none; color: #4a90e2; font-weight: bold;">Loading...</div>
    <div id="error" style="display:none; color: #ff5f56; font-weight: bold;"></div>
    <div id="content" style="display:none;">Content loaded successfully!</div>
    <div id="users"></div>
    <div id="todoList"></div>
    <div id="results"></div>
    <input id="searchInput" placeholder="Search..." />
    <div id="userList"></div>
    <div id="pagination"></div>
  `}</body>
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
        window._parentConsole.error('❌ ' + msg + ' (line ' + (line > 1 ? line - 1 : line) + ')');
        return true;
      };

      // Global Mocks for Educational Async/Fetch Snippets
      window.fetchUser = (id, cb) => { const p = new Promise(r => setTimeout(() => r({ id: id || 1, name: 'John Doe', email: 'john@example.com' }), 500)); if(typeof cb === 'function') p.then(cb); return p; };
      window.fetchPosts = (id, cb) => { const p = new Promise(r => setTimeout(() => r([{ id: 101, title: 'Async JS is fun!', content: '...' }, { id: 102, title: 'Learn Fetch', content: '...' }]), 500)); if(typeof cb === 'function') p.then(cb); return p; };
      window.fetchComments = (id, cb) => { const p = new Promise(r => setTimeout(() => r([{ id: 201, text: 'Great post!' }]), 500)); if(typeof cb === 'function') p.then(cb); return p; };
      window.fetchReplies = (id, cb) => { const p = new Promise(r => setTimeout(() => r([{ id: 301, text: 'Thanks!' }]), 500)); if(typeof cb === 'function') p.then(cb); return p; };
      window.fetchUserData = window.fetchUser;
      window.fetchData = () => new Promise((resolve) => setTimeout(() => resolve({ data: 'Successfully fetched!' }), 500));
      window.promise = new Promise(r => setTimeout(() => r('Data fetched successfully!'), 1000));
      window.getUserId = () => Promise.resolve(1);
      window.userId = 1; // Explicit global for snippets relying on it
      window.fetchOrders = () => Promise.resolve(['Order 1', 'Order 2']);
      window.processOrders = (o) => Promise.resolve('Processed ' + o.length + ' orders');
      window.someAsyncOperation = () => new Promise(r => setTimeout(() => r('Operation Success'), 500));
      window.showLoadingSpinner = () => console.log('UI: Loading Spinner SHOW');
      window.hideLoadingSpinner = () => console.log('UI: Loading Spinner HIDE');
      window.showErrorMessage = (msg) => console.error('UI Error Message:', msg);
      window.processData = (d) => d;
      window.processItem = (i) => Promise.resolve(i);
      window.fetchUserStats = () => Promise.resolve({ views: 100, likes: 20 });
      window.fetchNotifications = () => Promise.resolve(['New login']);
      window.fetchMessages = () => Promise.resolve(['Hello']);
      window.fetchFriends = () => Promise.resolve(['Jane', 'Bob']);
      window.fetchSettings = () => Promise.resolve({ theme: 'dark' });
      window.displayUserProfile = (p) => console.log('UI: Displayed User Profile');
      window.renderDashboard = (d) => console.log('UI: Rendered Dashboard');
      window.updateUI = (s) => console.log('UI State Updated:', JSON.stringify(s));
    `;
    doc.head.appendChild(interceptor);

    // Spin up the executable string wrapped firmly in native block scope
    // We use an async IIFE instead of a simple block {} so top-level await works magically!
    if (codeText && codeText.trim().length > 0) {
      const userScript = doc.createElement("script");
      userScript.textContent = `(async () => {\n${codeText}\n})();`;
      doc.body.appendChild(userScript);
    }

    // Safety net: if the user's code runs longer than 4 seconds (likely an
    // infinite loop), nuke the iframe and log a timeout error. Without this,
    // `while(true){}` hangs the whole browser tab until force-refresh.
    const timeoutMs = 4000;
    const timeoutId = setTimeout(() => {
      addToConsole(`⏱ Execution timeout (${timeoutMs}ms) — likely infinite loop. Iframe terminated.`, "error");
      if (iframe && iframe.parentNode) iframe.parentNode.removeChild(iframe);
    }, timeoutMs);

    // If the iframe finishes cleanly (load event), clear the timeout.
    iframe.addEventListener('load', () => clearTimeout(timeoutId), { once: true });

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
  // Ensure it doesn't have 'function', 'const', 'let', '=>' which are JS signatures
  if (!/(?:function|const|let|=>)/.test(code) && /^[ \t]*[a-zA-Z0-9.#:*,> \t-]+\s*\{[^}]*:[^}]+;/m.test(code)) {
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
 * Fallback clipboard copy using a temporary textarea + execCommand('copy').
 * Needed for file:// pages and insecure (http://) contexts where
 * navigator.clipboard is unavailable.
 * @param {string} text - Text to copy
 * @returns {boolean} true if copy succeeded
 */
function fallbackCopy(text) {
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-1000px';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch (e) {
    return false;
  }
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
