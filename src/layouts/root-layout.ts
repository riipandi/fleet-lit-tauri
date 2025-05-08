import { StoreController } from '@nanostores/lit'
import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { setActiveLeftPanel, toggleTerminalPanel, uiStore } from '#/stores/ui.store'
import { toggleMaximizeTerminalPanel } from '#/stores/ui.store'
import { toggleChatPanel } from '#/stores/ui.store'
import { noSelectStyles, scrollableStyles } from '#/styles/global.css'

// Import panel components
import './activity-bar'
import './title-bar'
import './panels'
import './statusbar'

/**
 * Root layout component that organizes the main application structure
 * Contains the activity bar, panels, and content area
 * Uses persistent storage for panel state
 */
@customElement('root-layout')
export class RootLayout extends LitElement {
  protected uiState = new StoreController(this, uiStore)

  /**
   * Toggles the visibility of a left panel
   * @param panelId - The ID of the panel to toggle
   */
  toggleLeftPanel(panelId: string) {
    const currentActivePanel = this.uiState.value.panels.activeLeftPanel

    if (currentActivePanel === panelId) {
      // If clicking the active panel, toggle visibility (hide it)
      setActiveLeftPanel(null)
    } else {
      // Otherwise, switch to the clicked panel
      setActiveLeftPanel(panelId)
    }
  }

  /**
   * Handles terminal maximize toggle
   */
  handleTerminalMaximizeToggle() {
    toggleMaximizeTerminalPanel()
  }

  /**
   * Handles chat panel toggle
   */
  handleChatPanelToggle() {
    toggleChatPanel()
  }

  /**
   * Handles left panel toggle from title bar
   */
  handleTitleBarLeftPanelToggle() {
    // If any left panel is currently active, hide it
    // Otherwise, show the explorer panel (default)
    const currentActivePanel = this.uiState.value.panels.activeLeftPanel

    if (currentActivePanel) {
      setActiveLeftPanel(null)
    } else {
      setActiveLeftPanel('explorer')
    }
  }

  /**
   * Handles terminal panel toggle from title bar
   */
  handleTitleBarTerminalToggle() {
    toggleTerminalPanel()
  }

  render() {
    const activeLeftPanel = this.uiState.value.panels.activeLeftPanel
    const terminalVisible = this.uiState.value.panels.terminal.visible
    const terminalMaximized = this.uiState.value.panels.terminal.maximized
    const chatVisible = this.uiState.value.panels.chat.visible

    return html`
      <div class="layout-container ${terminalMaximized ? 'terminal-maximized' : ''}">
        <my-titlebar
          @left-panel-toggle=${this.handleTitleBarLeftPanelToggle}
          @terminal-toggle=${this.handleTitleBarTerminalToggle}
          @chat-toggle=${this.handleChatPanelToggle}
        ></my-titlebar>
        <div class="main-area">
          <my-activitybar
            @left-panel-toggle=${(e: CustomEvent) => this.toggleLeftPanel(e.detail.panelId)}
            @terminal-toggle=${() => toggleTerminalPanel()}
            .activeLeftPanel=${activeLeftPanel}
            .terminalVisible=${terminalVisible}
            .terminalMaximized=${terminalMaximized}
          ></my-activitybar>

          <my-left-panel
            title="Explorer"
            panelId="explorer"
            ?visible=${activeLeftPanel === 'explorer'}
          >
            <panel-explorer></panel-explorer>
          </my-left-panel>

          <my-left-panel
            title="Search"
            panelId="search"
            ?visible=${activeLeftPanel === 'search'}
          >
            <panel-search></panel-search>
          </my-left-panel>

          <my-left-panel
            title="Source Control"
            panelId="git"
            ?visible=${activeLeftPanel === 'git'}
          >
            <panel-git></panel-git>
          </my-left-panel>

          <my-left-panel
            title="Settings"
            panelId="settings"
            ?visible=${activeLeftPanel === 'settings'}
          >
            <panel-settings></panel-settings>
          </my-left-panel>

          <div class="content-container">
            <div class="content-area scrollable">
              <slot></slot>
            </div>

            <my-bottom-panel
              title="Terminal"
              panelId="terminal"
              @maximize-toggle=${this.handleTerminalMaximizeToggle}
            >
              <panel-terminal></panel-terminal>
            </my-bottom-panel>
          </div>

          <my-right-panel
            title="Chat"
            panelId="chat"
            ?visible=${chatVisible}
          >
            <panel-chat></panel-chat>
          </my-right-panel>
        </div>
        <my-statusbar></my-statusbar>
      </div>
    `
  }

  static styles = [
    scrollableStyles,
    noSelectStyles,
    css`
      :host {
        display: block;
        width: 100%;
        height: 100vh;
        overflow: hidden;
      }

      .layout-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        font-family: var(--font-sans);
        color: var(--color-foreground);
        background-color: var(--color-background);
      }

      .main-area {
        display: flex;
        flex: 1;
        min-height: 0; /* Prevent overflow */
        overflow: hidden;
      }

      .content-container {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
      }

      .content-area {
        flex: 1;
        overflow: auto;
        background-color: var(--color-background);
        padding: 0;
      }

      /* Adjust layout when terminal is maximized */
      .layout-container.terminal-maximized .content-area {
        flex: 0 1 auto;
      }
    `,
  ]
}

declare global {
  interface HTMLElementTagNameMap {
    'root-layout': RootLayout
  }
}
