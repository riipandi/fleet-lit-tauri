import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { noSelectStyles } from '#/styles/global.css'

/**
 * Terminal panel content component
 * Displays terminal output and command input
 * Optimized for bottom panel layout
 */
@customElement('panel-terminal')
export class PanelTerminal extends LitElement {
  render() {
    return html`
      <div class="terminal-container">
        <div class="terminal-header">
          <div class="terminal-tabs">
            <div class="terminal-tab active">Terminal</div>
            <div class="terminal-tab">Output</div>
            <div class="terminal-tab">Problems</div>
          </div>
          <div class="terminal-actions">
            <button class="action-button">
              <lucide-icon name="plus" size="14"></lucide-icon>
            </button>
            <button class="action-button">
              <lucide-icon name="trash" size="14"></lucide-icon>
            </button>
          </div>
        </div>
        <div class="terminal-output selectable">
          <div class="terminal-line">Welcome to Fleet Lit Tauri Terminal</div>
          <div class="terminal-line">Type 'help' for available commands</div>
        </div>
        <div class="terminal-input-container">
          <span class="prompt">$</span>
          <input
            type="text"
            class="terminal-input"
            placeholder="Enter command..."
          />
        </div>
      </div>
    `
  }

  static styles = [
    noSelectStyles,
    css`
      :host {
        display: block;
        height: 100%;
      }

      .terminal-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: var(--color-sidebar-terminal);
        font-family: var(--font-mono);
        font-size: 12px;
        border-radius: var(--radius-sm);
        overflow: hidden;
      }

      .terminal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 8px;
        background-color: var(--color-sidebar-terminal-header);
        border-bottom: 1px solid var(--color-sidebar-border);
      }

      .terminal-tabs {
        display: flex;
      }

      .terminal-tab {
        padding: 2px 8px;
        cursor: pointer;
        border-radius: var(--radius-sm);
        margin-right: 4px;
      }

      .terminal-tab.active {
        background-color: var(--color-sidebar-terminal-tab-active);
      }

      .terminal-actions {
        display: flex;
        gap: 4px;
      }

      .action-button {
        background: transparent;
        border: none;
        color: var(--color-sidebar-foreground);
        opacity: 0.7;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2px;
        border-radius: var(--radius-sm);
      }

      .action-button:hover {
        background-color: var(--color-sidebar-accent);
        opacity: 1;
      }

      .terminal-output {
        flex: 1;
        padding: 8px;
        color: var(--color-sidebar-terminal-text);
        overflow: auto;
        min-height: 50px; /* Ensure there's always some space for output */
      }

      .terminal-line {
        padding: 2px 0;
        white-space: pre-wrap;
        word-break: break-all;
      }

      .terminal-input-container {
        display: flex;
        align-items: center;
        padding: 8px;
        border-top: 1px solid var(--color-sidebar-border);
      }

      .prompt {
        color: var(--color-sidebar-terminal-prompt);
        margin-right: 8px;
        font-weight: bold;
      }

      .terminal-input {
        flex: 1;
        background-color: transparent;
        border: none;
        color: var(--color-sidebar-terminal-text);
        font-family: var(--font-mono);
        font-size: 12px;
        outline: none;
      }
    `,
  ]
}

declare global {
  interface HTMLElementTagNameMap {
    'panel-terminal': PanelTerminal
  }
}
