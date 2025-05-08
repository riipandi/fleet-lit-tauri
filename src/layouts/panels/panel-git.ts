import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { noSelectStyles, scrollableStyles } from '#/styles/global.css'

/**
 * Git panel content component
 * Displays source control functionality and changes
 */
@customElement('panel-git')
export class PanelGit extends LitElement {
  render() {
    return html`
      <div class="git-container no-select">
        <div class="section-header">
          <span>CHANGES</span>
        </div>
        <div class="changes-list">
          <div class="git-placeholder">
            No changes detected in workspace
          </div>
        </div>
        <div class="commit-container">
          <textarea
            placeholder="Commit message"
            class="commit-message"
          ></textarea>
          <div class="commit-actions">
            <button class="commit-button">
              Commit
            </button>
            <button class="action-button">
              <lucide-icon name="refresh-cw" size="14"></lucide-icon>
            </button>
          </div>
        </div>
      </div>
    `
  }

  static styles = [
    scrollableStyles,
    noSelectStyles,
    css`
      :host {
        display: block;
        height: 100%;
      }

      .git-container {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .section-header {
        font-size: 11px;
        text-transform: uppercase;
        color: var(--color-sidebar-foreground);
        opacity: 0.7;
        margin-bottom: 8px;
        font-weight: 600;
      }

      .changes-list {
        flex: 1;
        min-height: 100px;
      }

      .git-placeholder {
        color: var(--color-muted-foreground);
        font-style: italic;
        font-size: 12px;
        text-align: center;
        padding: 16px 0;
      }

      .commit-container {
        margin-top: 8px;
        border-top: 1px solid var(--color-sidebar-border);
        padding-top: 8px;
      }

      .commit-message {
        width: 100%;
        height: 60px;
        background-color: var(--color-sidebar-input);
        border: 1px solid var(--color-sidebar-border);
        color: var(--color-sidebar-foreground);
        border-radius: var(--radius-sm);
        padding: 8px;
        font-size: 12px;
        resize: none;
        margin-bottom: 8px;
        font-family: var(--font-sans);
        box-sizing: border-box;
      }

      .commit-actions {
        display: flex;
        gap: 4px;
      }

      .commit-button {
        flex: 1;
        background-color: var(--color-sidebar-primary);
        color: var(--color-sidebar-primary-foreground);
        border: none;
        border-radius: var(--radius-sm);
        padding: 6px 12px;
        cursor: pointer;
        font-size: 12px;
      }

      .commit-button:hover {
        background-color: var(--color-sidebar-primary-hover);
      }

      .action-button {
        background-color: var(--color-sidebar-accent);
        color: var(--color-sidebar-accent-foreground);
        border: none;
        border-radius: var(--radius-sm);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 8px;
      }

      .action-button:hover {
        background-color: var(--color-sidebar-accent-hover);
      }
    `,
  ]
}

declare global {
  interface HTMLElementTagNameMap {
    'panel-git': PanelGit
  }
}
