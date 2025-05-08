import { css } from 'lit'

export const buttonStyles = css`
  :host {
    display: inline-block;
  }

  .button {
    border-radius: var(--radius-lg);
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.25s;
  }

  /* Primary variant */
  .button--primary {
    background-color: var(--color-primary);
    color: var(--color-primary-foreground);
  }
  .button--primary:hover {
    filter: brightness(1.1);
  }

  /* Secondary variant */
  .button--secondary {
    background-color: var(--color-secondary);
    color: var(--color-secondary-foreground);
    border-color: var(--color-border);
  }
  .button--secondary:hover {
    background-color: var(--color-accent);
  }

  /* Danger variant */
  .button--danger {
    background-color: var(--color-destructive);
    color: var(--color-destructive-foreground);
  }
  .button--danger:hover {
    filter: brightness(1.1);
  }

  /* Disabled state */
  .button--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Size variants */
  .button--small {
    font-size: 0.85em;
    padding: 0.4em 0.8em;
  }

  .button--large {
    font-size: 1.2em;
    padding: 0.8em 1.6em;
  }

  .button:focus,
  .button:focus-visible {
    outline: 4px auto var(--color-ring);
  }
`
