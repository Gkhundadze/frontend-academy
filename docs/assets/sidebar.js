/*
  Shared Sidebar Navigation
  -------------------------
  Single source of truth for the docs sidebar.
  Every doc page renders from this config, so adding a lesson only requires
  editing THIS file.

  Usage in a doc page:
    <nav class="sidebar" data-current-title="Semantic HTML"></nav>
    <script src="assets/sidebar.js"></script>
  (sidebar.js must load BEFORE script.js so active-link highlighting works)
*/

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // SIDEBAR CONFIG — edit here to change navigation across the whole site
  // ---------------------------------------------------------------------------
  const NAV_CONFIG = [
    {
      title: 'Part 1: HTML & CSS',
      items: [
        { href: 'web-fundamentals.html', label: 'Web Fundamentals' },
        { href: 'html-basics.html',      label: 'HTML Basics' },
        { href: 'semantic-html.html',    label: 'Semantic HTML' },
        { href: 'html-forms.html',       label: 'HTML Forms' },
        { href: 'css-basics.html',       label: 'CSS Basics' },
        { href: 'css-colors.html',       label: 'CSS Colors' },
        { href: 'box-model.html',        label: 'Box Model' },
        { href: 'css-units.html',        label: 'CSS Units' },
        { href: 'css-pseudo-classes.html', label: 'CSS Pseudo-Classes' },
        { href: 'flexbox.html',          label: 'Flexbox' },
        { href: 'css-grid.html',         label: 'CSS Grid' },
        { href: 'responsive-design.html', label: 'Responsive Design' },
        { href: 'responsive-images.html', label: 'Responsive Images' },
        { href: 'scss-basics.html',      label: 'SCSS Basics' },
        { href: 'css-architecture.html', label: 'CSS Architecture' },
      ]
    },
    {
      title: 'Part 2: JavaScript',
      items: [
        { href: 'javascript-basics.html',         label: 'JavaScript Basics' },
        { href: 'javascript-objects-arrays.html', label: 'Objects & Arrays' },
        { href: 'array-methods.html',             label: 'Array Methods' },
        { href: 'dom-manipulation.html',          label: 'DOM Manipulation' },
        { href: 'web-storage.html',               label: 'Web Storage API' },
        { href: 'event-handling.html',            label: 'Event Handling' },
        { href: 'async-javascript.html',          label: 'Async JavaScript' },
        { href: 'fetch-api.html',                 label: 'Fetch API & AJAX' },
        { href: 'advanced-javascript.html',       label: 'Advanced JavaScript' },
        { href: 'modern-javascript.html',         label: 'Modern JS (ES6+)' },
        { href: 'canvas-basics.html',             label: 'Canvas & Animation' },
      ]
    },
    {
      title: 'Part 3: React',
      items: [
        { href: 'react-introduction.html',      label: 'React Introduction' },
        { href: 'react-components.html',        label: 'Components & JSX' },
        { href: 'react-props-state.html',       label: 'Props & State' },
        { href: 'react-events.html',            label: 'Event Handling' },
        { href: 'react-lists.html',             label: 'Lists & Keys' },
        { href: 'react-forms.html',             label: 'Forms in React' },
        { href: 'react-hooks.html',             label: 'React Hooks' },
        { href: 'react-hooks-usecontext.html',  label: 'useContext Hook' },
        { href: 'react-context.html',           label: 'Context API' },
        { href: 'tailwind-css.html',            label: 'Tailwind CSS' },
      ]
    },
    {
      title: 'Part 4: Design Thinking',
      items: [
        { href: 'design-thinking-intro.html', label: 'Introduction to Design Thinking' },
        { href: 'user-research.html',         label: 'User Research & Personas' },
        { href: 'wireframing.html',           label: 'Wireframing & Prototyping' },
      ]
    },
    {
      title: 'Part 5: Professional Skills',
      items: [
        { href: 'performance-optimization.html', label: 'Performance Optimization' },
        { href: 'accessibility.html',            label: 'Web Accessibility' },
        { href: 'git-workflow.html',             label: 'Git & GitHub' },
        { href: 'team-collaboration.html',       label: 'Team Collaboration' },
        { href: 'deployment.html',               label: 'Deployment' },
      ]
    },
    {
      title: 'Projects',
      items: [
        { href: '../projects/landing-page/index.html',      label: 'Landing Page',     newTab: true },
        { href: '../projects/dark-mode/index.html',         label: 'Dark Mode Toggle', newTab: true },
        { href: '../projects/burger-menu/index.html',       label: 'Burger Menu',      newTab: true },
        { href: '../projects/snake-game/index.html',        label: 'Snake Game',       newTab: true },
        { href: '../projects/memory-game/index.html',       label: 'Memory Game',      newTab: true },
        { href: '../projects/quiz-app/index.html',          label: 'Quiz App',         newTab: true },
        { href: '../projects/react-tic-tac-toe/index.html', label: 'Tic Tac Toe',      newTab: true },
      ]
    },
    {
      title: 'Quick Links',
      items: [
        { href: '../index.html', label: '← Back to Home' },
      ]
    }
  ];

  // ---------------------------------------------------------------------------
  // RENDERER
  // ---------------------------------------------------------------------------
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function buildSidebarHTML(currentPageTitle) {
    const safeTitle = escapeHtml(currentPageTitle || 'Documentation');

    const headerHTML =
      '<div class="sidebar-header">' +
        '<h1>Frontend Course</h1>' +
        '<p>' + safeTitle + '</p>' +
      '</div>';

    const sectionsHTML = NAV_CONFIG.map(function (section) {
      const itemsHTML = section.items.map(function (item) {
        const href = escapeHtml(item.href);
        const label = escapeHtml(item.label);
        const target = item.newTab ? ' target="_blank" rel="noopener"' : '';
        return '<li><a href="' + href + '"' + target + '>' + label + '</a></li>';
      }).join('');

      return (
        '<div class="nav-section">' +
          '<div class="nav-section-title">' + escapeHtml(section.title) + '</div>' +
          '<ul class="nav-list">' + itemsHTML + '</ul>' +
        '</div>'
      );
    }).join('');

    return headerHTML + sectionsHTML;
  }

  function renderSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    // Read page title from data-attribute (falls back to document.title)
    const pageTitle = sidebar.dataset.currentTitle || document.title;
    sidebar.innerHTML = buildSidebarHTML(pageTitle);
  }

  // Run as soon as the sidebar element exists — ideally before script.js so
  // the active-link highlighter in script.js sees the rendered links.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderSidebar);
  } else {
    renderSidebar();
  }

  // Expose for debugging / future extension
  window.FrontendAcademyNav = { config: NAV_CONFIG, render: renderSidebar };
})();
