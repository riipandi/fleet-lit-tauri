import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { noSelectStyles } from '#/styles/global.css'

/**
 * Activity bar component that displays sidebar navigation icons
 * Allows switching between different panels
 */
@customElement('my-activitybar')
export class ActivityBar extends LitElement {
  @property({ type: String })
  activeLeftPanel: string | null = null

  @property({ type: Boolean })
  terminalVisible = false

  @property({ type: Boolean })
  terminalMaximized = false

  /**
   * Handles click on an activity bar icon for left panels
   * Dispatches panel-toggle event with the panel ID
   */
  handleLeftPanelToggle(panelId: string) {
    const event = new CustomEvent('left-panel-toggle', {
      detail: { panelId },
      bubbles: true,
      composed: true,
    })
    this.dispatchEvent(event)
  }

  /**
   * Handles click on the terminal icon
   * Dispatches terminal-toggle event
   */
  handleTerminalToggle() {
    const event = new CustomEvent('terminal-toggle', {
      bubbles: true,
      composed: true,
    })
    this.dispatchEvent(event)
  }

  render() {
    return html`
      <div class="top-icons">
        <div
          class="icon-button ${this.activeLeftPanel === 'explorer' ? 'active' : ''}"
          @click=${() => this.handleLeftPanelToggle('explorer')}
          title="Explorer"
        >
          <lucide-icon name="folder" size="16"></lucide-icon>
        </div>
        <div
          class="icon-button ${this.activeLeftPanel === 'search' ? 'active' : ''}"
          @click=${() => this.handleLeftPanelToggle('search')}
          title="Search"
        >
          <lucide-icon name="search" size="16"></lucide-icon>
        </div>
        <div
          class="icon-button ${this.activeLeftPanel === 'git' ? 'active' : ''}"
          @click=${() => this.handleLeftPanelToggle('git')}
          title="Source Control"
        >
          <lucide-icon name="git-branch" size="16"></lucide-icon>
        </div>
      </div>
      <div class="bottom-icons">
        <div
          class="icon-button ${this.terminalVisible ? 'active' : ''} ${this.terminalMaximized ? 'maximized' : ''}"
          @click=${this.handleTerminalToggle}
          title="${this.terminalMaximized ? 'Terminal (Maximized)' : 'Terminal'}"
        >
          <lucide-icon name="square-terminal" size="16"></lucide-icon>
        </div>
        <div
          class="icon-button ${this.activeLeftPanel === 'settings' ? 'active' : ''}"
          @click=${() => this.handleLeftPanelToggle('settings')}
          title="Settings"
        >
          <lucide-icon name="settings" size="16"></lucide-icon>
        </div>
      </div>
    `
  }

  static styles = [
    noSelectStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        width: var(--sidebar-width-icon);
        height: 100%;
        background-color: var(--color-sidebar);
        padding-top: 8px;
        padding-bottom: auto;
        border-right: 1px solid var(--color-sidebar-border);
        overflow-y: auto;
        flex-shrink: 0; /* Prevent the panel from shrinking */
        user-select: none;
      }

      .top-icons, .bottom-icons {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
      }

      .top-icons {
        flex-grow: 1;
      }

      .bottom-icons {
        margin-top: auto;
        margin-bottom: 8px;
      }

      .icon-button {
        width: 28px;
        height: 28px;
        padding: 1px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 8px;
        border-radius: var(--radius-sm);
        cursor: pointer;
        color: var(--color-sidebar-foreground);
        opacity: 0.7;
        position: relative;
      }

      .icon-button:hover {
        background-color: var(--color-sidebar-accent);
        color: var(--color-sidebar-accent-foreground);
        opacity: 1;
      }

      .icon-button.active {
        background-color: var(--color-sidebar-primary);
        color: var(--color-sidebar-primary-foreground);
        opacity: 1;
      }

      /* Indicator for maximized terminal */
      .icon-button.maximized::after {
        content: '';
        position: absolute;
        top: -2px;
        right: -2px;
        width: 6px;
        height: 6px;
        background-color: var(--color-sidebar-primary-foreground);
        border-radius: 50%;
      }
    `,
  ]
}

declare global {
  interface HTMLElementTagNameMap {
    'my-activitybar': ActivityBar
  }
}
