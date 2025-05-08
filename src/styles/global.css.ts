import { css } from 'lit'

// Make all elements scrollable and smooth scroll.
export const scrollableStyles = css`
  .scrollable {
    overflow: auto;
    scroll-behavior: smooth;
  }

  /* Scrollbar styling */
  .scrollable::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  .scrollable::-webkit-scrollbar-track {
    background: transparent;
  }

  .scrollable::-webkit-scrollbar-thumb {
    background-color: var(--color-border);
    border-radius: var(--radius-sm);
  }

  .scrollable::-webkit-scrollbar-thumb:hover {
    background-color: var(--color-ring);
  }
`

// Disable text selection for elements
export const noSelectStyles = css`
  .no-select {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: default;
  }

  /* For elements that should be clickable but not selectable */
  .no-select-pointer {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
  }

  .selectable {
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
    cursor: text;
  }

  /* For elements that should be selectable but maintain default cursor */
  .selectable-default {
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
    cursor: default;
  }

  /* For elements that should be selectable with auto cursor */
  .selectable-auto {
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
    cursor: auto;
  }
`

// Utility classes for active states
export const activeStateStyles = css`
  .active {
    background-color: var(--color-sidebar-primary);
    color: var(--color-sidebar-primary-foreground);
  }

  .active-accent {
    background-color: var(--color-sidebar-accent);
    color: var(--color-sidebar-accent-foreground);
  }

  .active-subtle {
    background-color: var(--color-muted);
    color: var(--color-foreground);
  }

  /* Active indicator styles */
  .active-indicator {
    position: relative;
  }

  .active-indicator::after {
    content: '';
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    background-color: currentColor;
    border-radius: 50%;
  }

  /* Border indicator styles */
  .border-indicator-left {
    position: relative;
  }

  .border-indicator-left::before {
    content: '';
    position: absolute;
    left: 0;
    top: 20%;
    height: 60%;
    width: 2px;
    background-color: var(--color-sidebar-primary);
  }

  .border-indicator-bottom {
    position: relative;
  }

  .border-indicator-bottom::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 20%;
    width: 60%;
    height: 2px;
    background-color: var(--color-sidebar-primary);
  }
`

// Utility classes for flex layouts
export const flexLayoutStyles = css`
  .flex {
    display: flex;
  }

  .flex-col {
    display: flex;
    flex-direction: column;
  }

  .items-center {
    align-items: center;
  }

  .justify-center {
    justify-content: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .gap-1 {
    gap: 4px;
  }

  .gap-2 {
    gap: 8px;
  }

  .gap-3 {
    gap: 12px;
  }

  .flex-1 {
    flex: 1;
  }

  .flex-shrink-0 {
    flex-shrink: 0;
  }

  .flex-grow-0 {
    flex-grow: 0;
  }
`
