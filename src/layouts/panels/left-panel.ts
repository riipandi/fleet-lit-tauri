import { StoreController } from '@nanostores/lit'
import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import { savePanelWidth, setActiveLeftPanel, uiStore } from '#/stores/ui.store'
import { noSelectStyles, scrollableStyles } from '#/styles/global.css'
import { resizeStyles } from '#/styles/resizable.css'
import { ResizeHandler } from '#/utils/resizable'

/**
 * Left panel container component
 * Acts as a container for different panel content components
 * Supports resizable width with persistent storage
 */
@customElement('my-left-panel')
export class LeftPanel extends LitElement {
  @property({ type: String }) title = 'Panel'
  @property({ type: Boolean, reflect: true }) visible = false
  @property({ type: String }) panelId = ''

  // Constants for panel behavior
  private readonly DEFAULT_WIDTH = 300
  private readonly MIN_WIDTH = 160
  private readonly MAX_WIDTH = 600
  private readonly COLLAPSE_THRESHOLD = 180

  private resizeHandler: ResizeHandler | null = null
  private panelContainer: HTMLElement | null = null

  protected uiState = new StoreController(this, uiStore)

  /**
   * Gets the current panel width from the store or uses default
   */
  get panelWidth(): number {
    if (!this.panelId) return this.DEFAULT_WIDTH

    const panelConfig =
      this.uiState.value.panels?.[this.panelId as keyof typeof this.uiState.value.panels]
    return (panelConfig as any)?.width || this.DEFAULT_WIDTH
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
        minWidth: this.MIN_WIDTH,
        maxWidth: this.MAX_WIDTH,
        onResize: (width) => {
          // If width becomes too small, consider collapsing the panel
          if (width <= this.COLLAPSE_THRESHOLD && this.visible) {
            this.panelContainer!.classList.add('collapsing')
          } else {
            this.panelContainer!.classList.remove('collapsing')
          }
        },
        onResizeEnd: (width) => {
          // If width is below collapse threshold, hide the panel
          if (width <= this.COLLAPSE_THRESHOLD && this.visible) {
            setActiveLeftPanel(null)
          } else if (this.panelId && width !== this.panelWidth) {
            savePanelWidth(this.panelId as any, width)
          }
        },
      })
    }

    this.resizeHandler?.startResize(e, this.panelWidth)
  }

  /**
   * Handles double click on resize handle
   * Resets panel to default width
   */
  private handleResizeDoubleClick() {
    if (this.panelId) {
      savePanelWidth(this.panelId as any, this.DEFAULT_WIDTH)

      // Update the panel width immediately in the UI
      if (this.panelContainer) {
        // Apply transition for smooth animation when resetting width
        this.panelContainer.style.transition = 'width 0.2s ease-out'
        this.panelContainer.style.width = `${this.DEFAULT_WIDTH}px`

        // Remove transition after animation completes
        setTimeout(() => {
          if (this.panelContainer) {
            this.panelContainer.style.transition = ''
          }
        }, 200)
      }
    }
  }

  render() {
    return html`
      <div class="panel-container" style=${styleMap({
        display: this.visible === true ? 'flex' : 'none',
        width: `${this.panelWidth}px`,
      })}>
        <div class="tool-window-header no-select">
          <span>${this.title}</span>
          <div class="header-actions">
            <button class="close-button" @click=${() => setActiveLeftPanel(null)} title="Close panel">
              <lucide-icon name="x" size="14"></lucide-icon>
            </button>
          </div>
        </div>
        <div class="tool-window-content scrollable">
          <slot></slot>
        </div>
        <div
          class="resize-handle"
          @mousedown=${this.handleResizeStart}
          @dblclick=${this.handleResizeDoubleClick}
          title="Double-click to reset width"
        ></div>
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
      }

      .panel-container {
        flex-direction: column;
        height: 100%;
        border-right: 1px solid var(--color-border);
        background-color: var(--color-sidebar);
        overflow: hidden;
        flex-shrink: 0;
        position: relative;
        /* Only apply transition when not resizing */
        transition: width 0.2s ease-out;
      }

      /* Add visual feedback when panel is about to collapse */
      .panel-container.collapsing {
        opacity: 0.8;
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

      .close-button:hover {
        background-color: var(--color-sidebar-accent);
        opacity: 1;
      }

      .tool-window-content {
        flex: 1;
        padding: 8px;
        overflow: auto;
      }

      /* Override the resize handle styles */
      .resize-handle {
        right: -3px;
        width: 4px;
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
    'my-left-panel': LeftPanel
  }
}
