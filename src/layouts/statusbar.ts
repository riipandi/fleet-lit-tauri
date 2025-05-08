import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { noSelectStyles } from '#/styles/global.css'

@customElement('my-statusbar')
export class StatusPanel extends LitElement {
  render() {
    return html`
      <div class="status-panel no-select">
        <div class="status-left">
          <span class="status-item">
            <lucide-icon name="git-branch" size="14"></lucide-icon>
            main
          </span>
        </div>
        <div class="status-right">
          <span class="status-item">
            <lucide-icon name="align-left" size="14"></lucide-icon>
            Line: 1, Column: 1
          </span>
          <span class="status-item">
            <lucide-icon name="file-text" size="14"></lucide-icon>
            UTF-8
          </span>
          <span class="status-item">
            <lucide-icon name="arrow-down-up" size="14"></lucide-icon>
            LF
          </span>
          <span class="status-item">
            <lucide-icon name="code" size="14"></lucide-icon>
            TypeScript
          </span>
        </div>
      </div>
    `
  }

  static styles = [
    noSelectStyles,
    css`
      :host {
        display: flex;
        background-color: var(--color-muted);
        border-top: 1px solid var(--color-border);
        height: 26px;
        font-size: 12px;
        color: var(--color-muted-foreground);
        width: 100%;
        flex-shrink: 0; /* Prevent the panel from shrinking */
        padding: 0;
      }

      .status-panel {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 100%;
      }

      .status-left {
        display: flex;
        align-items: center;
        min-width: 0;
        flex-shrink: 0;
      }

      .status-right {
        display: flex;
        align-items: center;
        min-width: 0;
        flex-grow: 0;
        flex-wrap: nowrap;
        overflow: hidden; /* Hide overflow instead of scrolling */
      }

      .status-item {
        display: flex;
        align-items: center;
        margin: 0 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis; /* Add ellipsis for text that overflows */
        gap: 4px;
        padding: 0 6px;
        height: 22px;
        border-radius: var(--radius-sm);
        cursor: pointer;
        opacity: 1;
      }

      .status-item:hover {
        background-color: var(--color-sidebar-accent);
        color: var(--color-sidebar-accent-foreground);
        opacity: 1;
      }

      .status-item.active {
        background-color: var(--color-sidebar-primary);
        color: var(--color-sidebar-primary-foreground);
        opacity: 1;
      }

      lucide-icon {
        color: inherit;
      }
    `,
  ]
}

declare global {
  interface HTMLElementTagNameMap {
    'my-statusbar': StatusPanel
  }
}
