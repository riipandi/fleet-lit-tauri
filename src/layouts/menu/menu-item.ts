import { LitElement, css, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { noSelectStyles } from '#/styles/global.css'
import { DOMPortal } from './menu-portal'
import type { MenuItem } from './menu-types'
import './menu-submenu'

/**
 * Component for rendering a single menu item in the menu bar
 * Handles both top-level menu items and nested submenu items
 */
@customElement('menu-item')
export class MenuItemComponent extends LitElement {
  /**
   * The menu item data to render
   */
  @property({ type: Object })
  item!: MenuItem

  /**
   * Whether this menu item is currently active/open
   */
  @property({ type: Boolean })
  active = false

  /**
   * Whether this is a top-level menu item
   */
  @property({ type: Boolean })
  isTopLevel = true

  /**
   * The nesting level of this menu item (0 for top level)
   */
  @property({ type: Number })
  level = 0

  /**
   * Reference to the menu item element for positioning
   */
  @query('.menu-item')
  menuItemElement!: HTMLElement

  /**
   * Portal for rendering submenu outside of shadow DOM
   */
  private portal: DOMPortal | null = null

  /**
   * Submenu element reference
   */
  private submenuElement: HTMLElement | null = null

  /**
   * Flag to track if we're currently in an update cycle
   */
  private isUpdating = false

  connectedCallback() {
    super.connectedCallback()
    // Set data-level attribute for easier access from portal
    this.setAttribute('data-level', this.level.toString())
  }

  /**
   * Handles click on the menu item
   */
  handleClick(e: Event) {
    // Stop propagation to prevent parent menu items from receiving the click
    e.stopPropagation()

    if (this.item.disabled) return

    if (this.item.action && !this.item.children?.length) {
      this.item.action()
      // Close menus after action
      this.dispatchEvent(new CustomEvent('menu-close', { bubbles: true, composed: true }))
    } else {
      this.dispatchEvent(
        new CustomEvent('menu-click', {
          bubbles: true,
          composed: true,
          detail: { id: this.item.id },
        }),
      )
    }
  }

  /**
   * Updates the submenu position when active state changes
   * Uses requestAnimationFrame to avoid scheduling updates during an update
   */
  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('level')) {
      // Update data-level attribute when level changes
      this.setAttribute('data-level', this.level.toString())
    }

    if (changedProperties.has('active') && !this.isUpdating) {
      // Use requestAnimationFrame to avoid scheduling updates during an update
      requestAnimationFrame(() => {
        this.isUpdating = true

        if (this.active) {
          this.createSubmenuPortal()
        } else {
          this.removeSubmenuPortal()
        }

        this.isUpdating = false
      })
    }
  }

  /**
   * Creates the submenu portal
   */
  createSubmenuPortal() {
    const hasChildren = this.item.children && this.item.children.length > 0

    if (!hasChildren) return

    // Always clean up existing portal first to prevent duplicates
    this.removeSubmenuPortal()

    // Create new portal
    this.portal = new DOMPortal(this)
    const portalContainer = this.portal.attach()

    // Create submenu element
    this.submenuElement = document.createElement('my-submenu')

    // Set data-level attribute on the submenu element
    this.submenuElement.setAttribute('data-level', (this.level + 1).toString())

    // Add to DOM first
    portalContainer.appendChild(this.submenuElement)

    // Then set properties
    // This ensures the custom element has been upgraded before we set properties
    setTimeout(() => {
      if (this.submenuElement) {
        // Set properties on the submenu element
        if (this.item.children) {
          ;(this.submenuElement as any).items = this.item.children
        }
        ;(this.submenuElement as any).level = this.level + 1
        ;(this.submenuElement as any).isTopLevel = false

        // Force a render if needed
        if (typeof (this.submenuElement as any).requestUpdate === 'function') {
          ;(this.submenuElement as any).requestUpdate()
        }
      }
    }, 0)

    // Position the submenu - THIS IS THE CRITICAL FIX
    if (this.menuItemElement && this.portal) {
      // Critical fix: Use position based on the actual level, not isTopLevel property
      // Level 0 is the top level menu bar, so only use bottom-start for level 0
      const position = this.level === 0 ? 'bottom-start' : 'right-start'

      // Log for debugging
      console.debug(
        `Positioning submenu for ${this.item.label} (level ${this.level}) using ${position}`,
      )

      this.portal.position(this.menuItemElement, position)
    }
  }

  /**
   * Removes the submenu portal
   */
  removeSubmenuPortal() {
    if (this.portal) {
      this.portal.detach()
      this.portal = null
      this.submenuElement = null
    }
  }

  /**
   * Clean up portal when element is removed
   */
  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeSubmenuPortal()
  }

  render() {
    if (this.item.separator) {
      return html`<div class="menu-separator"></div>`
    }

    const hasChildren = this.item.children && this.item.children.length > 0

    return html`
      <div
        class="menu-item ${this.isTopLevel ? 'top-level' : ''} ${this.active ? 'active' : ''} ${this.item.disabled ? 'disabled' : ''}"
        @click=${this.handleClick}
        data-level="${this.level}"
      >
        ${this.item.icon ? html`<span class="menu-icon">${this.item.icon}</span>` : ''}
        <span class="menu-label">${this.item.label}</span>
        ${this.item.shortcut ? html`<span class="menu-shortcut">${this.item.shortcut}</span>` : ''}
        ${
          hasChildren
            ? html`
          <span class="menu-arrow">
            ${
              this.level === 0
                ? html`<lucide-icon name="chevron-down" size="12"></lucide-icon>`
                : html`<lucide-icon name="chevron-right" size="12"></lucide-icon>`
            }
          </span>
        `
            : ''
        }
      </div>
    `
  }

  static styles = [
    noSelectStyles,
    css`
      :host {
        display: block;
        position: relative;
      }

      .menu-item {
        display: flex;
        align-items: center;
        padding: 0 8px;
        cursor: pointer;
        white-space: nowrap;
        height: 24px;
        font-size: 13px;
      }

      .menu-item.top-level {
        height: 30px;
        font-size: 13px;
      }

      .menu-item:hover:not(.disabled) {
        background-color: var(--color-accent);
        color: var(--color-accent-foreground);
      }

      .menu-item.active {
        background-color: var(--color-accent);
        color: var(--color-accent-foreground);
      }

      .menu-item.disabled {
        opacity: 0.5;
        cursor: default;
      }

      .menu-icon {
        margin-right: 6px;
        font-size: 12px;
      }

      .menu-label {
        flex: 1;
        font-weight: 400;
      }

      .menu-shortcut {
        margin-left: 12px;
        opacity: 0.7;
        font-size: 0.85em;
      }

      .menu-arrow {
        margin-left: 6px;
        display: flex;
        align-items: center;
      }

      .menu-separator {
        height: 1px;
        background-color: var(--color-border);
        margin: 3px 0;
      }
    `,
  ]
}

declare global {
  interface HTMLElementTagNameMap {
    'menu-item': MenuItemComponent
  }
}
