/**
 * A utility for creating portals that can render content outside of shadow DOM
 * This is particularly useful for overlays, dropdowns, and modals
 */
export class DOMPortal {
  private container: HTMLElement
  private parent: HTMLElement
  private isAttached = false
  private positionType: 'bottom-start' | 'right-start' = 'bottom-start'

  /**
   * Creates a new portal instance
   * @param parent - The parent element that will own the portal (usually the component itself)
   * @param container - Optional custom container element (defaults to a new div)
   */
  constructor(parent: HTMLElement, container?: HTMLElement) {
    this.parent = parent
    this.container = container || document.createElement('div')

    if (!container) {
      // Set default styling for the portal container
      this.container.style.position = 'fixed' // Use fixed positioning for viewport-relative positioning
      this.container.style.zIndex = '10000' // Very high z-index to ensure it's above everything
      this.container.className = 'my-portal-container' // Add class for potential styling

      // Critical fix: Ensure the container doesn't constrain the submenu width
      this.container.style.width = 'auto'
      this.container.style.maxWidth = 'none'
      this.container.style.display = 'inline-block'

      // Add font size to ensure consistent sizing
      this.container.style.fontSize = '13px'
    }
  }

  /**
   * Attaches the portal to the document body
   * @returns The portal container element
   */
  attach(): HTMLElement {
    if (!this.isAttached) {
      document.body.appendChild(this.container)
      this.isAttached = true

      // Clean up the portal when the parent is disconnected
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          const nodes = Array.from(mutation.removedNodes)
          if (nodes.indexOf(this.parent) >= 0 || nodes.some((n) => n?.contains?.(this.parent))) {
            this.detach()
            observer.disconnect()
            break
          }
        }
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })
    }

    return this.container
  }

  /**
   * Detaches the portal from the document body
   */
  detach(): void {
    if (this.isAttached && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container)
      this.isAttached = false
    }
  }

  /**
   * Updates the position of the portal relative to an anchor element
   * @param anchorEl - The element to position the portal relative to
   * @param position - The position strategy (default: 'bottom-start')
   */
  position(anchorEl: HTMLElement, position: 'bottom-start' | 'right-start' = 'bottom-start'): void {
    const rect = anchorEl.getBoundingClientRect()
    this.positionType = position

    // Add a small offset to prevent overlapping with the anchor
    const OFFSET = 1

    // Clear any previous positioning
    this.container.style.top = ''
    this.container.style.left = ''
    this.container.style.right = ''
    this.container.style.bottom = ''

    // Set initial position based on the requested position type
    if (position === 'bottom-start') {
      this.container.style.top = `${rect.bottom + OFFSET}px`
      this.container.style.left = `${rect.left}px`
    } else if (position === 'right-start') {
      this.container.style.top = `${rect.top}px`
      this.container.style.left = `${rect.right + OFFSET}px`
    }

    // Add a data attribute to help with debugging
    this.container.setAttribute('data-position', position)

    // Get the level from the parent element
    const level = this.parent.getAttribute('data-level') || (this.parent as any).level || 1

    // Store the level as a data attribute for debugging
    this.container.setAttribute('data-level', level.toString())

    // Set z-index based on level to ensure proper stacking
    this.container.style.zIndex = `${10000 + Number.parseInt(level.toString())}`

    // Wait for the content to be rendered before adjusting position
    setTimeout(() => this.adjustPosition(rect), 0)
  }

  /**
   * Adjusts the position of the portal to ensure it stays within the viewport
   */
  private adjustPosition(anchorRect: DOMRect): void {
    const menuRect = this.container.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Adjust horizontal position if needed
    if (menuRect.right > viewportWidth) {
      if (this.positionType === 'right-start') {
        // If it's a submenu, show it on the left side instead
        this.container.style.left = `${anchorRect.left - menuRect.width - 2}px`
      } else {
        // Otherwise, align to the right edge of the anchor
        this.container.style.left = `${viewportWidth - menuRect.width - 2}px`
      }
    }

    // Adjust vertical position if needed
    if (menuRect.bottom > viewportHeight) {
      if (this.positionType === 'bottom-start') {
        // Show above the anchor if there's not enough space below
        this.container.style.top = `${anchorRect.top - menuRect.height - 2}px`
      } else {
        // For right-start, adjust the top position to keep it in viewport
        const newTop = Math.max(0, Math.min(anchorRect.top, viewportHeight - menuRect.height))
        this.container.style.top = `${newTop}px`
      }
    }
  }
}
