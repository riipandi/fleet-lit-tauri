import { getCurrentWindow } from '@tauri-apps/api/window'
import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import appLogo from '~/assets/images/tauri.svg'

/**
 * Traffic lights component for macOS window controls (close, minimize, maximize)
 * Implements native macOS-style window controls with proper focus behavior
 * Shows app logo in fullscreen mode with quick transitions
 */
@customElement('traffic-lights')
export class TrafficLights extends LitElement {
  @state()
  private isHovering = false

  @state()
  private isFullscreen = false

  @state()
  private isExitingFullscreen = false

  @state()
  private isWindowFocused = true

  /**
   * Controls whether the traffic lights are visible
   */
  @property({ type: Boolean, reflect: true })
  visible = false

  /**
   * Controls whether the menu bar is visible
   * When menu bar is visible, we should hide the fullscreen logo
   */
  @property({ type: Boolean })
  menuVisible = false

  // Store cleanup functions
  private _cleanupFunctions: Array<() => void> = []

  async connectedCallback() {
    super.connectedCallback()

    const appWindow = getCurrentWindow()

    try {
      // Initialize component state
      this.isFullscreen = await appWindow.isFullscreen()
      this.isWindowFocused = await appWindow.isFocused()

      // Monitor fullscreen changes
      const checkFullscreen = async () => {
        const fullscreen = await appWindow.isFullscreen()
        if (this.isFullscreen !== fullscreen) {
          this.isFullscreen = fullscreen
          // Reset exiting flag when fullscreen state has actually changed
          this.isExitingFullscreen = false
        }
      }

      // Listen for focus changes
      const unlistenFocus = await appWindow.onFocusChanged(({ payload: focused }) => {
        this.isWindowFocused = focused
        this.requestUpdate()
      })
      this._cleanupFunctions.push(unlistenFocus)

      // Check fullscreen periodically
      const fullscreenInterval = window.setInterval(checkFullscreen, 1000)
      this._cleanupFunctions.push(() => clearInterval(fullscreenInterval))
    } catch (error) {
      console.error('Error initializing traffic lights:', error)
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
  }

  render() {
    // Styles for traffic lights - hide when visible=false
    const trafficLightsStyles = {
      display: this.visible ? 'flex' : 'none',
    }

    // Determine container class based on fullscreen state and transition state
    const containerClass = this.isFullscreen
      ? 'fullscreen'
      : this.isExitingFullscreen
        ? 'exiting-fullscreen'
        : ''

    // Styles for fullscreen logo - hide when menuVisible=true
    const fullscreenLogoStyles = {
      display: this.menuVisible ? 'none' : 'flex',
    }

    // Always show the container and logo, regardless of visible property
    return html`
      <div class="container ${containerClass}">
        <!-- Logo for fullscreen mode - always rendered but conditionally displayed -->
        <div class="fullscreen-logo" style=${styleMap(fullscreenLogoStyles)}>
          <img src=${appLogo} class="logo" alt="Fleet Lit Tauri" />
        </div>

        <!-- Traffic lights for normal mode - conditionally displayed -->
        <div
          class="traffic-lights ${this.isHovering ? 'hover' : ''} ${this.isWindowFocused ? 'window-focused' : ''}"
          style=${styleMap(trafficLightsStyles)}
          @mouseenter=${() => (this.isHovering = true)}
          @mouseleave=${() => (this.isHovering = false)}
        >
          <button class="traffic-light close" @click=${this.handleClose} title="Close">
            <svg width="7" height="7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path stroke="#000" stroke-width="1.2" stroke-linecap="round" d="M1.182 5.99L5.99 1.182M5.99 6.132L1.182 1.323" />
            </svg>
          </button>
          <button class="traffic-light minimize" @click=${this.handleMinimize} title="Minimize">
            <svg width="7" height="2" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path stroke="#000" stroke-width="1.2" stroke-linecap="round" d="M.61.703h5.8" />
            </svg>
          </button>
          <button class="traffic-light fullscreen" @click=${this.handleFullscreen} title="Fullscreen">
            <svg width="8" height="7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path stroke="#000" stroke-width="1.2" stroke-linecap="round" d="M1.1 3.4h5.8M3.9 6.4V.6" />
            </svg>
          </button>
        </div>
      </div>
    `
  }

  /**
   * Closes the current window
   */
  private async handleClose() {
    try {
      const appWindow = getCurrentWindow()
      await appWindow.close()
    } catch (error) {
      console.error('Failed to close window:', error)
    }
  }

  /**
   * Minimizes the current window
   */
  private async handleMinimize() {
    try {
      const appWindow = getCurrentWindow()
      await appWindow.minimize()
    } catch (error) {
      console.error('Failed to minimize window:', error)
    }
  }

  /**
   * Toggles fullscreen mode for the current window
   */
  private async handleFullscreen() {
    try {
      const appWindow = getCurrentWindow()
      const isFullscreen = await appWindow.isFullscreen()

      // If we're exiting fullscreen, set the exiting flag immediately
      if (isFullscreen) {
        this.isExitingFullscreen = true
        this.requestUpdate()
      }

      // Toggle fullscreen state
      await appWindow.setFullscreen(!isFullscreen)

      // Update state after toggling fullscreen
      setTimeout(async () => {
        this.isFullscreen = await appWindow.isFullscreen()
        this.isExitingFullscreen = false
      }, 50) // Faster response time
    } catch (error) {
      console.error('Failed to toggle fullscreen:', error)
    }
  }

  static styles = css`
    :host {
      /* macOS traffic light colors */
      --close-red: #ff6159;
      --close-red-active: #bf4942;
      --minimize-yellow: #ffbd2e;
      --minimize-yellow-active: #bf8e22;
      --maximize-green: #28c941;
      --maximize-green-active: #1d9730;
      --disabled-gray: #ddd;

      /* Quick transition timing */
      --quick-duration: 80ms;
      --bounce-timing: cubic-bezier(0.175, 0.885, 0.32, 1.275);

      display: block;
      height: 100%;
    }

    /* Container for both elements */
    .container {
      position: relative;
      height: 100%;
      width: 100%;
    }

    /* Fullscreen logo styles with quick transitions */
    .fullscreen-logo {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 100%;
      padding-left: 6px;
      opacity: 0;
      transform: scale(0.9);
      transition:
        opacity var(--quick-duration) ease-out,
        transform var(--quick-duration) var(--bounce-timing);
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
    }

    /* Show logo in fullscreen mode with a slight bounce */
    .container.fullscreen .fullscreen-logo {
      opacity: 1;
      transform: scale(1);
      pointer-events: auto;
    }

    /* Hide logo quickly when exiting fullscreen */
    .container.exiting-fullscreen .fullscreen-logo {
      opacity: 0;
      transform: scale(0.9);
      transition:
        opacity 50ms ease-in,
        transform 50ms ease-in;
      pointer-events: none;
    }

    .logo {
      height: 24px;
      transition: filter 300ms;
    }

    .logo:hover {
      filter: drop-shadow(0 0 1em var(--color-primary));
    }

    /* Traffic lights container with quick transitions */
    .traffic-lights {
      display: flex;
      gap: 8px;
      padding-left: 4px;
      align-items: center;
      height: 100%;
      opacity: 0;
      transform: scale(0.9);
      transition:
        opacity var(--quick-duration) ease-out,
        transform var(--quick-duration) var(--bounce-timing);
      pointer-events: none;
    }

    /* Hide traffic lights in fullscreen mode */
    .container.fullscreen .traffic-lights {
      opacity: 0;
      transform: scale(0.9);
      pointer-events: none;
    }

    /* Show traffic lights in normal mode with a slight bounce */
    .container:not(.fullscreen):not(.exiting-fullscreen) .traffic-lights {
      opacity: 1;
      transform: scale(1);
      pointer-events: auto;
    }

    /* Show traffic lights quickly when exiting fullscreen */
    .container.exiting-fullscreen .traffic-lights {
      opacity: 1;
      transform: scale(1);
      transition:
        opacity 50ms ease-out,
        transform 50ms var(--bounce-timing);
      pointer-events: auto;
    }

    /* Base button styles */
    .traffic-light {
      border-radius: 50%;
      padding: 0;
      height: 13px;
      width: 13px;
      border: 1px solid rgba(0, 0, 0, 0.06);
      box-sizing: border-box;
      background-color: var(--disabled-gray);
      position: relative;
      outline: none;
      margin: 0;
      cursor: pointer;
      transition: background-color 100ms ease, transform 100ms ease;
    }

    /* Add a subtle hover effect */
    .traffic-light:hover {
      transform: scale(1.05);
    }

    .traffic-light:active {
      transform: scale(0.95);
    }

    /* Icon positioning */
    .traffic-light svg {
      position: absolute;
      transform: translate(-50%, -50%);
      top: 50%;
      left: 50%;
      visibility: hidden;
      transition: visibility 50ms;
    }

    /* Show icons on hover */
    .traffic-lights.hover .traffic-light svg {
      visibility: visible;
    }

    /* Colored buttons when window is focused */
    .traffic-lights.window-focused .close {
      background-color: var(--close-red);
    }

    .traffic-lights.window-focused .minimize {
      background-color: var(--minimize-yellow);
    }

    .traffic-lights.window-focused .fullscreen {
      background-color: var(--maximize-green);
    }

    /* Active state for buttons */
    .traffic-lights.window-focused .close:active {
      background-color: var(--close-red-active);
    }

    .traffic-lights.window-focused .minimize:active {
      background-color: var(--minimize-yellow-active);
    }

    .traffic-lights.window-focused .fullscreen:active {
      background-color: var(--maximize-green-active);
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'traffic-lights': TrafficLights
  }
}
