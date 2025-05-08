import { StoreController } from '@nanostores/lit'
import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import { savePanelHeight, toggleTerminalPanel, uiStore } from '#/stores/ui.store'
import { toggleMaximizeTerminalPanel } from '#/stores/ui.store'
import { noSelectStyles, scrollableStyles } from '#/styles/global.css'
import { resizeStyles } from '#/styles/resizable.css'
import { ResizeHandler } from '#/utils/resizable'

/**
 * Bottom panel container component
 * Acts as a container for different panel content components
 * Supports resizable height with persistent storage
 */
@customElement('my-bottom-panel')
export class BottomPanel extends LitElement {
  @property({ type: String }) title = 'Panel'
  @property({ type: String }) panelId = ''

  // Constants for panel behavior
  private readonly DEFAULT_HEIGHT = 250
  private readonly MIN_HEIGHT = 120
  private readonly MAX_HEIGHT = 500
  private readonly COLLAPSE_THRESHOLD = 100

  private resizeHandler: ResizeHandler | null = null
  private panelContainer: HTMLElement | null = null

  protected uiState = new StoreController(this, uiStore)

  /**
   * Gets the current panel height from the store or uses default
   */
  get panelHeight(): number {
    if (!this.panelId) return this.DEFAULT_HEIGHT

    const panelConfig =
      this.uiState.value.panels?.[this.panelId as keyof typeof this.uiState.value.panels]
    return (panelConfig as any)?.height || this.DEFAULT_HEIGHT
  }

  /**
   * Gets the visibility state from the store
   */
  get isVisible(): boolean {
    if (!this.panelId) return false

    const panelConfig =
      this.uiState.value.panels?.[this.panelId as keyof typeof this.uiState.value.panels]
    return (panelConfig as any)?.visible || false
  }

  /**
   * Gets the maximized state from the store
   */
  get isMaximized(): boolean {
    if (!this.panelId) return false

    const panelConfig =
      this.uiState.value.panels?.[this.panelId as keyof typeof this.uiState.value.panels]
    return (panelConfig as any)?.maximized || false
  }

  /**
   * Handles the start of resize operation
   */
  private handleResizeStart(e: MouseEvent) {
    if (!this.panelContainer) {
      this.panelContainer = this.shadowRoot?.querySelector('.panel-container') as HTMLElement
    }

    if (this.panelContainer && !this.resizeHandler) {
      this.resizeHandler = new ResizeHandler(this.panelContainer, {
        minHeight: this.MIN_HEIGHT,
        maxHeight: this.MAX_HEIGHT,
        vertical: true,
        onResize: (height) => {
          // If height becomes too small, consider collapsing the panel
          if (height <= this.COLLAPSE_THRESHOLD && this.isVisible) {
            this.panelContainer!.classList.add('collapsing')
          } else {
            this.panelContainer!.classList.remove('collapsing')
          }
        },
        onResizeEnd: (height) => {
          // If height is below collapse threshold, hide the panel
          if (height <= this.COLLAPSE_THRESHOLD && this.isVisible) {
            toggleTerminalPanel()
          } else if (this.panelId && height !== this.panelHeight) {
            savePanelHeight(this.panelId as any, height)

            // If panel was maximized, turn off maximized state when manually resized
            if (this.isMaximized) {
              toggleMaximizeTerminalPanel()
            }
          }
        },
      })
    }

    this.resizeHandler?.startResize(e, this.isMaximized ? 400 : this.panelHeight)
  }

  /**
   * Handles double click on resize handle
   * Resets panel to default height
   */
  private handleResizeDoubleClick() {
    if (this.panelId) {
      // If maximized, toggle back to normal
      if (this.isMaximized) {
        toggleMaximizeTerminalPanel()
      } else {
        savePanelHeight(this.panelId as any, this.DEFAULT_HEIGHT)
      }

      // Update the panel height immediately in the UI
      if (this.panelContainer && !this.isMaximized) {
        // Apply transition for smooth animation when resetting height
        this.panelContainer.style.transition = 'height 0.2s ease-out'
        this.panelContainer.style.height = `${this.DEFAULT_HEIGHT}px`

        // Remove transition after animation completes
        setTimeout(() => {
          if (this.panelContainer) {
            this.panelContainer.style.transition = ''
          }
        }, 200)
      }
    }
  }

  /**
   * Toggles the maximized state of the panel
   */
  private handleMaximizeToggle() {
    toggleMaximizeTerminalPanel()
  }

  render() {
    // Calculate panel height based on maximized state
    const panelContainerStyle = styleMap({
      height: this.isMaximized ? '90vh' : `${this.panelHeight}px`,
      display: this.isVisible ? 'flex' : 'none',
    })

    return html`
      <div class="no-select panel-container ${this.isMaximized ? 'maximized' : ''}" style=${panelContainerStyle}>
        <div
          data-vertical
          class="resize-handle"
          @mousedown=${this.handleResizeStart}
          @dblclick=${this.handleResizeDoubleClick}
          title="Double-click to reset height"
        ></div>
        <div class="tool-window-header no-select">
          <span>${this.title}</span>
          <div class="header-actions">
            <button class="action-button" @click=${this.handleMaximizeToggle} title="${this.isMaximized ? 'Restore' : 'Maximize'} panel">
              <lucide-icon name="${this.isMaximized ? 'minimize-2' : 'maximize-2'}" size="14"></lucide-icon>
            </button>
            <button class="close-button" @click=${toggleTerminalPanel} title="Close panel">
              <lucide-icon name="x" size="14"></lucide-icon>
            </button>
          </div>
        </div>
        <div class="tool-window-content scrollable">
          <slot></slot>
        </div>
      </div>
    `
  }

  static styles = [
    scrollableStyles,
    noSelectStyles,
    resizeStyles,
    css`
      :host {
        display: block;
        position: relative;
        width: 100%;
      }

      .panel-container {
        flex-direction: column;
        width: 100%;
        border-top: 1px solid var(--color-border);
        background-color: var(--color-sidebar);
        overflow: hidden;
        flex-shrink: 0;
        position: relative;
        /* Only apply transition when not resizing */
        transition: height 0.2s ease-out;
      }

      /* Add visual feedback when panel is about to collapse */
      .panel-container.collapsing {
        opacity: 0.8;
      }

      /* Styles for maximized state */
      .panel-container.maximized {
        z-index: 10;
      }

      .tool-window-header {
        padding: 8px 12px;
        font-weight: bold;
        border-bottom: 1px solid var(--color-sidebar-border);
        color: var(--color-sidebar-foreground);
        flex-shrink: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .header-actions {
        display: flex;
        gap: 4px;
      }

      .action-button,
      .close-button {
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

      .action-button:hover,
      .close-button:hover {
        background-color: var(--color-sidebar-accent);
        opacity: 1;
      }

      .tool-window-content {
        flex: 1;
        padding: 0;
        overflow: auto;
      }
    `,
  ]

  disconnectedCallback() {
    super.disconnectedCallback()
    // Clean up resize handler when component is removed
    this.resizeHandler?.cleanup()
    this.resizeHandler = null
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-bottom-panel': BottomPanel
  }
}
