import { css } from 'lit'

/**
 * Global styles for resize functionality
 * Includes cursor styles and prevents selection during resize
 */
export const resizeStyles = css`
  body.resizing {
    cursor: col-resize !important;
    user-select: none !important;
  }

  body.resizing[data-resize-vertical] {
    cursor: row-resize !important;
  }

  body.resizing * {
    user-select: none !important;
    /* Disable all transitions during active resize for immediate feedback */
    transition: none !important;
  }

  .resize-handle {
    position: absolute;
    cursor: col-resize;
    z-index: 10;
    background-color: transparent;
  }

  /* Horizontal resize handle (for width) */
  .resize-handle:not([data-vertical]) {
    top: 0;
    right: -3px;
    width: 4px;
    height: 100%;
  }

  /* Vertical resize handle (for height) */
  .resize-handle[data-vertical] {
    left: 0;
    top: -3px;
    width: 100%;
    height: 4px;
    cursor: row-resize;
  }

  .resize-handle:hover {
    background-color: var(--color-resize-handle-hover, rgba(127, 127, 127, 0.4));
  }

  .resize-handle:active {
    background-color: var(--color-resize-handle-active, rgba(127, 127, 127, 0.6));
  }
`
