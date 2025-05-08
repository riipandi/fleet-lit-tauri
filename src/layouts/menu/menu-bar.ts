import { getCurrentWindow } from '@tauri-apps/api/window'
import { type Platform, platform } from '@tauri-apps/plugin-os'
import { LitElement, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import appLogo from '~/assets/images/tauri.svg'
import { noSelectStyles } from '#/styles/global.css'
import { menuBarStyles } from '#/styles/menu-bar.css'
import type { MenuItem } from './menu-types'
import './menu-item'

/**
 * Menu bar component that displays the top-level menu items
 * and handles menu interactions
 */
@customElement('menu-bar')
export class MenuBar extends LitElement {
  /**
   * Array of menu items to display in the menu bar
   */
  @property({ type: Array })
  menuItems: MenuItem[] = []

  /**
   * Currently active/open menu item
   */
  @property({ type: String })
  activeMenu: string | null = null

  /**
   * Controls whether the menu bar is visible
   */
  @property({ type: Boolean, reflect: true })
  visible = false

  /**
   * Platform information
   */
  @property({ type: String })
  platform: Platform = 'macos'

  /**
   * Check if running on macOS
   */
  @state() isMacOS = false

  /**
   * Check if running in Tauri environment
   */
  @state() isTauri = false

  /**
   * Check if window is in fullscreen mode
   */
  @state() isFullscreen = false

  // Track if we're handling a double-click
  private isHandlingDoubleClick = false

  // Store event handler references for cleanup
  private _mouseDownHandler: ((e: Event) => void) | null = null
  private _doubleClickHandler: ((e: Event) => void) | null = null

  // Store cleanup functions
  private _cleanupFunctions: Array<() => void> = []

  /**
   * Toggles the active menu
   * @param menuId - The ID of the menu to toggle
   */
  toggleMenu(menuId: string) {
    if (this.activeMenu === menuId) {
      this.activeMenu = null
    } else {
      this.activeMenu = menuId
    }

    this.dispatchEvent(
      new CustomEvent('menu-toggle', {
        detail: { menuId: this.activeMenu },
        bubbles: true,
        composed: true,
      }),
    )
  }

  /**
   * Closes all open menus
   */
  closeAllMenus() {
    if (this.activeMenu !== null) {
      this.activeMenu = null

      // Notify parent components that menus have been closed
      this.dispatchEvent(
        new CustomEvent('menu-toggle', {
          detail: { menuId: null },
          bubbles: true,
          composed: true,
        }),
      )
    }
  }

  /**
   * Minimize the window
   */
  async minimizeWindow() {
    const appWindow = getCurrentWindow()
    await appWindow.minimize()
  }

  /**
   * Maximize, fullscreen, or restore the window based on platform
   * This is used for the maximize button click
   */
  async maximizeWindow() {
    try {
      const appWindow = getCurrentWindow()

      if (this.isMacOS) {
        // On macOS, toggle fullscreen mode
        const isFullscreen = await appWindow.isFullscreen()
        await appWindow.setFullscreen(!isFullscreen)
      } else {
        // On other platforms, toggle maximize/unmaximize
        const isMaximized = await appWindow.isMaximized()
        if (isMaximized) {
          await appWindow.unmaximize()
        } else {
          await appWindow.maximize()
        }
      }
    } catch (error) {
      console.error('Failed to toggle maximize/fullscreen:', error)
    }
  }

  /**
   * Toggle maximize/unmaximize regardless of platform
   */
  async toggleMaximize() {
    try {
      // Set flag to prevent other handlers
      this.isHandlingDoubleClick = true

      const appWindow = getCurrentWindow()
      const isMaximized = await appWindow.isMaximized()

      if (isMaximized) {
        await appWindow.unmaximize()
      } else {
        await appWindow.maximize()
      }

      // Reset flag after a delay
      setTimeout(() => {
        this.isHandlingDoubleClick = false
      }, 300)
    } catch (error) {
      console.error('Failed to toggle maximize:', error)
      this.isHandlingDoubleClick = false
    }
  }

  /**
   * Close the window
   */
  async closeWindow() {
    const appWindow = getCurrentWindow()
    await appWindow.close()
  }

  /**
   * Handle double-click on menu area
   */
  async handleMenuAreaDoubleClick(e: Event) {
    // Prevent default and stop propagation
    e.preventDefault()
    e.stopPropagation()

    // Toggle maximize
    await this.toggleMaximize()
  }

  /**
   * Handle single-click for dragging
   */
  async handleMenuAreaMouseDown(e: Event) {
    // Cast event to MouseEvent to access mouse-specific properties
    const mouseEvent = e as MouseEvent

    // Check if the click is on a non-interactive area
    const target = mouseEvent.target as HTMLElement
    const isMenuItemClick = target.closest('menu-item')
    const isButtonClick = target.closest('button')

    // Only start dragging if not clicking on interactive elements
    // and not currently handling a double-click
    if (
      !isMenuItemClick &&
      !isButtonClick &&
      mouseEvent.buttons === 1 &&
      !this.isHandlingDoubleClick
    ) {
      const appWindow = getCurrentWindow()
      await appWindow.startDragging()
    }
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('platform')) {
      this.isMacOS = this.platform === 'macos'
    }
  }

  async connectedCallback() {
    super.connectedCallback()

    // Check if running in Tauri environment
    this.isTauri = '__TAURI__' in window

    // Detect platform if not provided
    if (!this.platform) {
      try {
        this.platform = platform()
        this.isMacOS = this.platform === 'macos'
      } catch (error) {
        console.error('Failed to detect platform:', error)
      }
    } else {
      this.isMacOS = this.platform === 'macos'
    }

    try {
      const appWindow = getCurrentWindow()

      // Initialize fullscreen state
      this.isFullscreen = await appWindow.isFullscreen()

      // Monitor fullscreen changes
      const checkFullscreen = async () => {
        const fullscreen = await appWindow.isFullscreen()
        if (this.isFullscreen !== fullscreen) {
          this.isFullscreen = fullscreen
          this.requestUpdate()
        }
      }

      // Check fullscreen periodically
      const fullscreenInterval = window.setInterval(checkFullscreen, 1000)
      this._cleanupFunctions.push(() => clearInterval(fullscreenInterval))
    } catch (error) {
      console.error('Failed to initialize fullscreen detection:', error)
    }

    // Add global event listeners
    this.addEventListener('menu-close', this.closeAllMenus)

    // Add document click handler to close menus when clicking outside
    setTimeout(() => {
      const handleOutsideClick = (e: MouseEvent) => {
        // Only close if clicking outside the menu system
        const target = e.target as HTMLElement
        const isMenuClick = target.closest('menu-bar, menu-item, my-submenu')

        if (!isMenuClick && this.activeMenu) {
          this.closeAllMenus()
        }
      }

      document.addEventListener('click', handleOutsideClick)

      // Store for cleanup
      ;(this as any)._outsideClickHandler = handleOutsideClick
    }, 0)

    // Add keyboard handler for Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.activeMenu) {
        this.closeAllMenus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    ;(this as any)._keyDownHandler = handleKeyDown
  }

  firstUpdated() {
    // Create bound handlers
    this._mouseDownHandler = this.handleMenuAreaMouseDown.bind(this)
    this._doubleClickHandler = this.handleMenuAreaDoubleClick.bind(this)

    // Add event listeners for dragging after the component is rendered
    const menuArea = this.shadowRoot?.querySelector('.menu-area')
    if (menuArea) {
      menuArea.addEventListener('mousedown', this._mouseDownHandler as EventListener)
      menuArea.addEventListener('dblclick', this._doubleClickHandler as EventListener)
    }

    const appLogo = this.shadowRoot?.querySelector('.app-logo')
    if (appLogo) {
      appLogo.addEventListener('mousedown', this._mouseDownHandler as EventListener)
      appLogo.addEventListener('dblclick', this._doubleClickHandler as EventListener)
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()

    // Clean up all listeners and intervals
    for (const cleanup of this._cleanupFunctions) {
      try {
        cleanup()
      } catch (error) {
        console.error('Error during cleanup:', error)
      }
    }
    this._cleanupFunctions = []

    // Remove event listeners
    this.removeEventListener('menu-close', this.closeAllMenus)

    if ((this as any)._outsideClickHandler) {
      document.removeEventListener('click', (this as any)._outsideClickHandler)
    }

    if ((this as any)._keyDownHandler) {
      document.removeEventListener('keydown', (this as any)._keyDownHandler)
    }

    // Clean up dragging event listeners
    if (this._mouseDownHandler && this._doubleClickHandler) {
      const menuArea = this.shadowRoot?.querySelector('.menu-area')
      if (menuArea) {
        menuArea.removeEventListener('mousedown', this._mouseDownHandler as EventListener)
        menuArea.removeEventListener('dblclick', this._doubleClickHandler as EventListener)
      }

      const appLogo = this.shadowRoot?.querySelector('.app-logo')
      if (appLogo) {
        appLogo.removeEventListener('mousedown', this._mouseDownHandler as EventListener)
        appLogo.removeEventListener('dblclick', this._doubleClickHandler as EventListener)
      }
    }

    // Clear handler references
    this._mouseDownHandler = null
    this._doubleClickHandler = null
  }

  render() {
    if (!this.visible) {
      return html``
    }

    // Determine if we should show the app logo and window controls
    // Show app logo in fullscreen mode or when not on macOS or when not in Tauri
    const showAppLogo = this.isFullscreen || !(this.isMacOS && this.visible) || !this.isTauri

    // Show window controls when not on macOS or when in Tauri but not in fullscreen
    const showWindowControls = !(this.isMacOS && this.visible) && this.isTauri && !this.isFullscreen

    // Add a class to indicate if we're in Tauri and if macOS needs special padding
    const menuAreaClasses = [
      'menu-area',
      'no-select',
      this.isMacOS ? 'macos' : 'non-macos',
      this.isTauri ? 'tauri-env' : 'browser-env',
      this.isMacOS && this.isTauri ? 'macos-tauri' : '',
      this.isFullscreen ? 'fullscreen' : '',
    ]
      .filter(Boolean)
      .join(' ')

    return html`
      <div class="${menuAreaClasses}">
        ${
          showAppLogo
            ? html`
          <div class="app-logo">
            <img src=${appLogo} class="logo" alt="Fleet Lit Tauri" />
          </div>
        `
            : ''
        }

        <div class="menu-items">
          ${this.menuItems.map(
            (menuItem) => html`
            <menu-item
              .item=${menuItem}
              ?active=${this.activeMenu === menuItem.id}
              ?isTopLevel=${true}
              .level=${0}
              @menu-click=${() => this.toggleMenu(menuItem.id)}
            ></menu-item>
          `,
          )}
        </div>

        ${
          showWindowControls
            ? html`
          <div class="window-controls">
            <button class="window-control minimize" @click=${this.minimizeWindow} title="Minimize">
              <svg width="10" height="10" viewBox="0 0 12 12">
                <rect x="1" y="6" width="10" height="1" fill="currentColor" />
              </svg>
            </button>
            <button class="window-control maximize" @click=${this.maximizeWindow} title="${this.isMacOS ? 'Fullscreen' : 'Maximize'}">
              <svg width="10" height="10" viewBox="0 0 12 12">
                <rect x="1.5" y="1.5" width="9" height="9" stroke="currentColor" fill="none" stroke-width="1" />
              </svg>
            </button>
            <button class="window-control close" @click=${this.closeWindow} title="Close">
              <svg width="10" height="10" viewBox="0 0 12 12">
                <path d="M2 2L10 10M2 10L10 2" stroke="currentColor" stroke-width="1.25" />
              </svg>
            </button>
          </div>
        `
            : ''
        }
      </div>
    `
  }

  static styles = [noSelectStyles, menuBarStyles]
}

declare global {
  interface HTMLElementTagNameMap {
    'menu-bar': MenuBar
  }
}
