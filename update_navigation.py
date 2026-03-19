#!/usr/bin/env python3
"""Add Design Thinking and JavaScript navigation sections to all documentation pages."""

import os
import re

# Navigation sections to add
JAVASCRIPT_NAV = '''
      <div class="nav-section">
        <div class="nav-section-title">Part 2: JavaScript</div>
        <ul class="nav-list">
          <li><a href="javascript-basics.html">JavaScript Basics</a></li>
          <li><a href="javascript-objects-arrays.html">Objects & Arrays</a></li>
          <li><a href="array-methods.html">Array Methods</a></li>
          <li><a href="dom-manipulation.html">DOM Manipulation</a></li>
          <li><a href="event-handling.html">Event Handling</a></li>
          <li><a href="async-javascript.html">Async JavaScript</a></li>
          <li><a href="fetch-api.html">Fetch API & AJAX</a></li>
          <li><a href="canvas-basics.html">Canvas & Animation</a></li>
        </ul>
      </div>
'''

DESIGN_THINKING_NAV = '''
      <div class="nav-section">
        <div class="nav-section-title">Part 3: Design Thinking</div>
        <ul class="nav-list">
          <li><a href="design-thinking-intro.html">Introduction to Design Thinking</a></li>
          <li><a href="user-research.html">User Research & Personas</a></li>
          <li><a href="wireframing.html">Wireframing & Prototyping</a></li>
          <li><a href="ui-ux-principles.html">UI/UX Principles</a></li>
          <li><a href="design-systems.html">Design Systems</a></li>
          <li><a href="accessibility-design.html">Accessibility & Inclusive Design</a></li>
        </ul>
      </div>
'''

PROJECTS_NAV = '''
      <div class="nav-section">
        <div class="nav-section-title">Projects</div>
        <ul class="nav-list">
          <li><a href="../projects/quiz-app/index.html" target="_blank">Quiz App Project</a></li>
        </ul>
      </div>
'''

def update_navigation(filepath):
    """Update navigation in a single HTML file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if file already has Design Thinking navigation
    if 'Part 3: Design Thinking' in content:
        print(f"✓ {os.path.basename(filepath)} - Already updated")
        return False

    # Find the Quick Links section
    quick_links_pattern = r'(\s*<div class="nav-section">\s*<div class="nav-section-title">Quick Links</div>)'

    if not re.search(quick_links_pattern, content):
        print(f"✗ {os.path.basename(filepath)} - Could not find Quick Links section")
        return False

    # Check if JavaScript section exists
    has_javascript = 'Part 2: JavaScript' in content

    # Build the sections to insert
    sections_to_add = ''
    if not has_javascript:
        sections_to_add += JAVASCRIPT_NAV
    sections_to_add += DESIGN_THINKING_NAV
    sections_to_add += PROJECTS_NAV

    # Insert before Quick Links
    new_content = re.sub(
        quick_links_pattern,
        sections_to_add + r'\1',
        content
    )

    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"✓ {os.path.basename(filepath)} - Updated")
    return True

def main():
    """Update all HTML files in docs directory."""
    docs_dir = '/home/giga/frontend-course-docs/docs'

    # Files to update (exclude Design Thinking pages as they're already correct)
    html_files = [
        'web-fundamentals.html',
        'html-basics.html',
        'semantic-html.html',
        'html-forms.html',
        'css-basics.html',
        'box-model.html',
        'flexbox.html',
        'css-grid.html',
        'responsive-design.html',
        'scss-basics.html',
        'javascript-basics.html',
        'javascript-objects-arrays.html',
        'array-methods.html',
        'dom-manipulation.html',
        'event-handling.html',
        'async-javascript.html',
        'fetch-api.html',
        'canvas-basics.html'
    ]

    updated_count = 0

    print("Updating navigation in HTML files...\n")

    for filename in html_files:
        filepath = os.path.join(docs_dir, filename)
        if os.path.exists(filepath):
            if update_navigation(filepath):
                updated_count += 1
        else:
            print(f"✗ {filename} - File not found")

    print(f"\n✅ Updated {updated_count} files")
    print(f"All pages now include:")
    print(f"  • Part 1: HTML & CSS")
    print(f"  • Part 2: JavaScript")
    print(f"  • Part 3: Design Thinking")
    print(f"  • Projects")

if __name__ == '__main__':
    main()
