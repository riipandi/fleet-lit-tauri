import { css } from 'lit'

/**
 * Styles for the menu bar component
 */
export const menuBarStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    font-size: 13px;
  }

  :host([visible="false"]) {
    display: none;
  }

  .menu-area {
    display: flex;
    align-items: center;
    padding: 0;
    height: 34px;
    background-color: var(--color-card);
    border-bottom: 1px solid var(--color-border);
    width: 100%;
    overflow: hidden; /* Prevent overflow */
    cursor: default; /* Show default cursor for draggable area */
    position: relative; /* Ensure proper positioning context */
  }

  /* Apply padding to the content area instead of the container */
  .menu-area.macos.tauri-env .menu-items {
    padding-left: 76px; /* Left spacing for macOS in Tauri environment */
  }

  /* No special padding needed when not in Tauri environment */
  .menu-area.macos.browser-env .menu-items {
    padding-left: 8px; /* Regular padding when in browser */
  }

  /* No special padding needed when in fullscreen mode */
  .menu-area.macos.fullscreen .menu-items {
    padding-left: 8px; /* Regular padding when in fullscreen */
  }

  .app-logo {
    display: flex;
    align-items: center;
    margin-right: 8px;
    margin-left: 16px;
    flex-shrink: 0; /* Prevent logo from shrinking */
    cursor: default; /* Show default cursor for draggable area */
  }

  .logo {
    height: 20px;
    transition: filter 300ms;
  }

  .logo:hover {
    filter: drop-shadow(0 0 1em var(--color-primary));
  }

  .menu-items {
    display: flex;
    min-width: 0; /* Allow container to shrink below content size */
    flex-grow: 1;
    flex-shrink: 1; /* Allow shrinking */
    padding-left: 3px;
    overflow: hidden; /* Hide overflow instead of scrolling */
    white-space: nowrap; /* Keep items in a single line */
  }

  /* Window control buttons */
  .window-controls {
    display: flex;
    align-items: center;
    margin-left: auto;
    height: 100%;
    flex-shrink: 0; /* Prevent controls from shrinking */
  }

  .window-control {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 100%;
    background: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    color: var(--color-text);
    transition: all 0.15s ease;
    flex-shrink: 0; /* Prevent buttons from shrinking */
  }

  .window-control:focus {
    outline: none;
  }

  .window-control.minimize:hover {
    background-color: rgba(128, 128, 128, 0.2);
  }

  .window-control.maximize:hover {
    background-color: rgba(128, 128, 128, 0.2);
  }

  .window-control.close {
    border-top-right-radius: 4px;
  }

  .window-control.close:hover {
    background-color: rgba(232, 17, 35, 0.9);
    color: white;
  }

  .window-control svg {
    width: 10px;
    height: 10px;
  }

  /* Responsive adjustments */
  @media (max-width: 500px) {
    .app-logo {
      margin-right: 4px;
      margin-left: 6px;
    }

    .menu-items {
      margin-right: 4px; /* Add some spacing before window controls on small screens */
    }

    .window-control {
      width: 36px; /* Slightly smaller buttons on very small screens */
    }
  }
`
