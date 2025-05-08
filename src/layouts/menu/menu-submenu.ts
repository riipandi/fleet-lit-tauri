import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { noSelectStyles } from '#/styles/global.css'
import type { MenuItem } from './menu-types'

/**
 * Component for rendering a submenu dropdown
 * Supports nested submenus up to 3 levels deep
 * Designed to work with the portal system for proper z-index handling
 */
@customElement('my-submenu')
export class Submenu extends LitElement {
  /**
   * Array of menu items to display in the submenu
   */
  @property({ type: Array })
  items: MenuItem[] = []

  /**
   * The nesting level of this submenu (1-3)
   */
  @property({ type: Number })
  level = 1

  /**
   * Whether this submenu belongs to a top-level menu item
   */
  @property({ type: Boolean })
  isTopLevel = false

  /**
   * Currently active/open submenu item
   */
  @property({ type: String })
  activeSubmenu: string | null = null

  connectedCallback() {
    super.connectedCallback()

    // Set data-level attribute for easier access from portal
    this.setAttribute('data-level', this.level.toString())

    // Add click handler to close menu when clicking outside
    setTimeout(() => {
      const handleOutsideClick = (e: MouseEvent) => {
        if (!this.contains(e.target as Node)) {
          // Only handle clicks completely outside the menu system
          const parent = (e.target as HTMLElement).closest('menu-item, my-submenu')
          if (!parent) {
            this.dispatchEvent(
              new CustomEvent('menu-close', {
                bubbles: true,
                composed: true,
              }),
            )
            document.removeEventListener('click', handleOutsideClick)
          }
        }
      }

      document.addEventListener('click', handleOutsideClick)

      // Store the handler for cleanup
      ;(this as any)._outsideClickHandler = handleOutsideClick
    }, 0)
  }

  disconnectedCallback() {
    super.disconnectedCallback()

    // Remove event listener when component is removed
    if ((this as any)._outsideClickHandler) {
      document.removeEventListener('click', (this as any)._outsideClickHandler)
    }
  }

  /**
   * Toggles the active submenu
   * @param menuId - The ID of the submenu to toggle
   */
  toggleSubmenu(menuId: string) {
    if (this.activeSubmenu === menuId) {
      this.activeSubmenu = null
    } else {
      this.activeSubmenu = menuId
    }
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('level')) {
      // Update data-level attribute when level changes
      this.setAttribute('data-level', this.level.toString())
    }
  }

  render() {
    // Don't render beyond level 3
    if (this.level > 3) return html``

    return html`
      <div
        class="submenu-container ${this.isTopLevel ? 'top-level' : ''} level-${this.level}"
        data-level="${this.level}"
      >
        ${this.items.map(
          (item) => html`
          <menu-item
            .item=${item}
            .level=${this.level}
            ?active=${this.activeSubmenu === item.id}
            ?isTopLevel=${false}
            @menu-click=${(e: CustomEvent) => this.toggleSubmenu(e.detail.id)}
          ></menu-item>
        `,
        )}
      </div>
    `
  }

  static styles = [
    noSelectStyles,
    css`
      :host {
        display: block;
        position: relative;
        margin-left: -4px; /* Make submenu overlap with parent slightly */
      }

      .submenu-container {
        background-color: var(--color-card);
        border: 1px solid var(--color-border);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        min-width: 160px;
        max-width: 240px;
        overflow: visible;
        border-radius: 4px;
        padding: 3px 0;
        font-size: 13px;
      }

      /* Add specific styles for different levels */
      .submenu-container.level-2,
      .submenu-container.level-3 {
        position: relative;
      }
    `,
  ]
}

declare global {
  interface HTMLElementTagNameMap {
    'my-submenu': Submenu
  }
}
