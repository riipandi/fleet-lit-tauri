import { css } from 'lit'

export const titleBarStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid var(--color-border);
    background-color: var(--color-card);
    flex-shrink: 0; /* Prevent the panel from shrinking */
    width: 100%;
    z-index: 100; /* Ensure title bar is above other content */
  }

  .titlebar-container {
    display: flex;
    width: 100%;
    align-items: center;
    cursor: default; /* Show default cursor for draggable area */
  }

  .editor-toolbar {
    height: 42px;
    display: flex;
    align-items: center;
    padding-left: 6px;
    padding-right: 8px; /* Right padding to the toolbar buttons */
    border-top: none;
    justify-content: space-between;
    cursor: default; /* Show default cursor for draggable area */
    width: 100%;
    box-sizing: border-box; /* Ensure padding is included in total width */
  }

  .toolbar-navigation {
    display: flex;
    flex-grow: 1;
    align-items: center;
    margin-right: 4px;
    gap: 8px;
    min-width: 0; /* Allow container to shrink below content size */
    overflow: hidden; /* Hide overflow instead of scrolling */
    white-space: nowrap; /* Keep content on a single line */
  }

  /* If menu is visible on any platform: 8px left margin */
  .toolbar-navigation.menu-visible {
    margin-left: 2px;
  }

  /* If macOS, menu not visible, and in Tauri: 76px left margin */
  .toolbar-navigation.macos-tauri-no-menu {
    margin-left: 76px;
  }

  /* If macOS, menu not visible, but not in Tauri: 8px left margin */
  .toolbar-navigation.macos-browser-no-menu {
    margin-left: 8px;
  }

  /* Non-macOS with hidden menu: 2px left margin */
  .toolbar-navigation.non-macos {
    margin-left: 2px;
  }

  /* macOS in fullscreen mode: no left margin */
  .toolbar-navigation.macos-fullscreen {
    margin-left: 40px;
  }

  .project-selector, .search-button {
    display: flex;
    align-items: center;
    background: transparent;
    border: none;
    color: var(--color-foreground);
    cursor: pointer;
    height: 28px;
    padding: 0 8px;
    border-radius: var(--radius-sm);
    font-size: 13px;
    transition: background-color 0.2s;
    flex-shrink: 0; /* Prevent project selector from shrinking */
  }

  .search-button {
    flex-shrink: 1; /* Allow search button to shrink if needed */
    min-width: 0; /* Allow search button to shrink below content size */
    overflow: hidden; /* Hide overflow */
  }

  .project-selector:hover, .search-button:hover {
    background-color: var(--color-accent);
  }

  .project-name {
    margin: 0 6px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .search-text {
    margin: 0 6px;
    color: var(--color-muted-foreground);
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .shortcut-hint {
    font-size: 11px;
    opacity: 0.7;
    color: var(--color-muted-foreground);
    background-color: var(--color-muted);
    padding: 1px 4px;
    border-radius: 3px;
    flex-shrink: 0; /* Prevent shortcut hint from shrinking */
  }

  .vertical-separator {
    width: 1px;
    height: 20px;
    background-color: var(--color-border);
    margin: 0 4px;
    flex-shrink: 0; /* Prevent separator from shrinking */
  }

  .toolbar-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0; /* Prevent actions from shrinking */
    margin-right: 6px; /* Add right margin for additional spacing */
  }

  .toolbar-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    color: var(--color-muted-foreground);
    cursor: pointer;
    height: 26px;
    width: 26px;
    padding: 0;
    transition: background-color 0.2s, color 0.2s;
    flex-shrink: 0; /* Prevent buttons from shrinking */
    position: relative;
  }

  .toolbar-button:hover {
    background-color: var(--color-accent);
    color: var(--color-accent-foreground);
  }

  /* Style for active toolbar buttons - more subtle */
  .toolbar-button.active {
    color: var(--color-foreground);
    background-color: transparent;
    opacity: 0.9;
  }

  /* Add subtle bottom border indicator for active panels instead of dot */
  .toolbar-button.active::after {
    content: '';
    position: absolute;
    bottom: 2px; /* Moved up from bottom be closer to the icon */
    left: 50%;
    transform: translateX(-50%);
    width: 12px;
    height: 2px;
    background-color: var(--color-foreground);
    border-radius: 1px;
    opacity: 0.6;
  }
`
