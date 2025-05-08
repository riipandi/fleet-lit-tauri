import { StoreController } from '@nanostores/lit'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { type Platform, platform } from '@tauri-apps/plugin-os'
import { LitElement, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { uiStore } from '#/stores/ui.store'
import { activeStateStyles, flexLayoutStyles, noSelectStyles } from '#/styles/global.css'
import { titleBarStyles } from '#/styles/title-bar.css'
import { defaultMenuItems } from './menu'
import './traffic-lights'

/**
 * Title bar component that contains the application menu and tabs
 */
@customElement('my-titlebar')
export class TitleBar extends LitElement {
  /**
   * Currently active menu
   */
  @state() activeMenu: string | null = null

  /**
   * Controls whether the menu bar is visible
   */
  @property({ type: Boolean }) menuVisible = true

  /**
   * Platform information
   */
  @state() appPlatform: Platform = 'macos'

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

  /**
   * Current project name
   */
  @state() currentProject = 'Open Project'

  /**
   * Store controller for UI state
   */
  protected uiState = new StoreController(this, uiStore)

  // Store cleanup functions
  private _cleanupFunctions: Array<() => void> = []

  /**
   * Handles menu toggle events
   */
  handleMenuToggle(e: CustomEvent) {
    this.activeMenu = e.detail.menuId
  }

  /**
   * Handles window dragging when clicking on the title bar
   */
  async handleTitlebarMouseDown(e: Event) {
    // Cast the event to MouseEvent to access mouse-specific properties
    const mouseEvent = e as MouseEvent

    if (mouseEvent.buttons === 1) {
      // Primary (left) button
      const appWindow = getCurrentWindow()

      if (mouseEvent.detail === 2) {
        // Double click - toggle maximize
        const isMaximized = await appWindow.isMaximized()
        if (isMaximized) {
          await appWindow.unmaximize()
        } else {
          await appWindow.maximize()
        }
      } else {
        // Single click - start dragging
        await appWindow.startDragging()
      }
    }
  }

  /**
   * Handles project selector click
   */
  handleProjectClick() {
    console.log('Project selector clicked')
    // Implement project selection logic here
  }

  /**
   * Handles search button click
   */
  handleSearchClick() {
    console.log('Search button clicked')
    // Implement search functionality here
  }

  /**
   * Handles left panel toggle
   */
  handleLeftPanelToggle() {
    this.dispatchEvent(new CustomEvent('left-panel-toggle'))
  }

  /**
   * Handles terminal panel toggle
   */
  handleTerminalPanelToggle() {
    this.dispatchEvent(new CustomEvent('terminal-toggle'))
  }

  /**
   * Handles chat panel toggle
   */
  handleChatPanelToggle() {
    this.dispatchEvent(new CustomEvent('chat-toggle'))
  }

  async connectedCallback() {
    super.connectedCallback()

    // Check if running in Tauri environment
    this.isTauri = '__TAURI__' in window

    try {
      this.appPlatform = platform()
      this.isMacOS = this.appPlatform === 'macos'
      // Automatically hide menu on macOS
      if (this.isMacOS) {
        this.menuVisible = false
      }

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
      console.error('Failed to detect platform:', error)
    }
  }

  firstUpdated() {
    // Add event listeners for dragging after the component is rendered
    const titlebarContainer = this.shadowRoot?.querySelector('.titlebar-container')
    if (titlebarContainer) {
      titlebarContainer.addEventListener('mousedown', this.handleTitlebarMouseDown.bind(this))
    }

    const toolbarNavigation = this.shadowRoot?.querySelector('.toolbar-navigation')
    if (toolbarNavigation) {
      toolbarNavigation.addEventListener('mousedown', this.handleTitlebarMouseDown.bind(this))
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

    // Clean up event listeners
    const titlebarContainer = this.shadowRoot?.querySelector('.titlebar-container')
    if (titlebarContainer) {
      titlebarContainer.removeEventListener('mousedown', this.handleTitlebarMouseDown.bind(this))
    }

    const toolbarNavigation = this.shadowRoot?.querySelector('.toolbar-navigation')
    if (toolbarNavigation) {
      toolbarNavigation.removeEventListener('mousedown', this.handleTitlebarMouseDown.bind(this))
    }
  }

  render() {
    // Get panel states from the store
    const activeLeftPanel = this.uiState.value.panels.activeLeftPanel
    const terminalVisible = this.uiState.value.panels.terminal.visible
    const chatVisible = this.uiState.value.panels.chat.visible

    // Determine the navigation class based on platform, menu visibility, environment, and fullscreen state
    let navigationClass = 'non-macos'

    if (this.menuVisible) {
      navigationClass = 'menu-visible'
    } else if (this.isMacOS) {
      if (this.isFullscreen) {
        navigationClass = 'macos-fullscreen'
      } else if (this.isTauri) {
        navigationClass = 'macos-tauri-no-menu'
      } else {
        navigationClass = 'macos-browser-no-menu'
      }
    }

    // Classes for toolbar buttons
    const leftPanelClasses = {
      'toolbar-button': true,
      active: activeLeftPanel !== null,
      'active-indicator': activeLeftPanel !== null,
    }

    const terminalClasses = {
      'toolbar-button': true,
      active: terminalVisible,
      'active-indicator': terminalVisible,
    }

    const chatClasses = {
      'toolbar-button': true,
      active: chatVisible,
      'active-indicator': chatVisible,
    }

    return html`
      <div class="titlebar-container">
        <menu-bar
          .menuItems=${defaultMenuItems}
          .activeMenu=${this.activeMenu}
          ?visible=${this.menuVisible}
          .platform=${this.appPlatform}
          @menu-toggle=${this.handleMenuToggle}
        ></menu-bar>
      </div>
      <div class="editor-toolbar no-select">
        <traffic-lights ?visible=${false} ?menuVisible=${this.menuVisible}></traffic-lights>
        <div class="toolbar-navigation ${navigationClass}">
          <!-- Project selector and search bar -->
          <button class="project-selector no-select-pointer" @click=${this.handleProjectClick}>
            <lucide-icon name="folder" size="16"></lucide-icon>
            <span class="project-name">${this.currentProject}</span>
            <lucide-icon name="chevron-down" size="14"></lucide-icon>
          </button>

          <div class="vertical-separator"></div>

          <button class="search-button" @click=${this.handleSearchClick}>
            <lucide-icon name="search" size="14"></lucide-icon>
            <span class="search-text">Search Everywhere</span>
            <span class="shortcut-hint">⇧⌘P</span>
          </button>

          <!-- Tabs will go here -->
        </div>
        <div class="toolbar-actions">
          <button
            class=${classMap(leftPanelClasses)}
            @click=${this.handleLeftPanelToggle}
            title="Toggle Explorer Panel"
          >
            <lucide-icon name="panel-left" size="16"></lucide-icon>
          </button>
          <button
            class=${classMap(terminalClasses)}
            @click=${this.handleTerminalPanelToggle}
            title="Toggle Terminal Panel"
          >
            <lucide-icon name="panel-bottom" size="16"></lucide-icon>
          </button>
          <button
            class=${classMap(chatClasses)}
            @click=${this.handleChatPanelToggle}
            title="Toggle Chat Panel"
          >
            <lucide-icon name="panel-right" size="16"></lucide-icon>
          </button>
        </div>
      </div>
    `
  }

  static styles = [noSelectStyles, activeStateStyles, flexLayoutStyles, titleBarStyles]
}

declare global {
  interface HTMLElementTagNameMap {
    'my-titlebar': TitleBar
  }
}
