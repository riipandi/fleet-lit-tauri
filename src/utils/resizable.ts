/**
 * Utility class for handling resize operations
 * Provides methods for starting, moving, and ending resize operations
 */
export class ResizeHandler {
  private isResizing = false
  private startX = 0
  private startY = 0
  private startWidth = 0
  private startHeight = 0
  private element: HTMLElement
  private minWidth: number
  private maxWidth: number
  private minHeight: number
  private maxHeight: number
  private vertical: boolean
  private onResize: (size: number) => void
  private onResizeEnd: (size: number) => void
  private lastSize = 0
  private invertDirection: boolean

  /**
   * Creates a new ResizeHandler
   * @param element - The element to resize
   * @param options - Configuration options
   */
  constructor(
    element: HTMLElement,
    options: {
      minWidth?: number
      maxWidth?: number
      minHeight?: number
      maxHeight?: number
      vertical?: boolean
      invertDirection?: boolean
      onResize?: (size: number) => void
      onResizeEnd?: (size: number) => void
    } = {},
  ) {
    this.element = element
    this.minWidth = options.minWidth || 200
    this.maxWidth = options.maxWidth || 500
    this.minHeight = options.minHeight || 120
    this.maxHeight = options.maxHeight || 500
    this.vertical = options.vertical || false
    this.invertDirection = options.invertDirection || false
    this.onResize = options.onResize || (() => {})
    this.onResizeEnd = options.onResizeEnd || (() => {})

    // Bind methods to this instance
    this.handleResizeMove = this.handleResizeMove.bind(this)
    this.handleResizeEnd = this.handleResizeEnd.bind(this)
  }

  /**
   * Starts a resize operation
   * @param e - The mouse event that triggered the resize
   */
  public startResize(e: MouseEvent, startSize?: number) {
    this.isResizing = true
    this.startX = e.clientX
    this.startY = e.clientY

    if (this.vertical) {
      this.startHeight = startSize || this.element.offsetHeight
      this.lastSize = this.startHeight
    } else {
      this.startWidth = startSize || this.element.offsetWidth
      this.lastSize = this.startWidth
    }

    // Disable transitions during resize for immediate feedback
    this.element.style.transition = 'none'

    // Add event listeners for mouse move and up
    window.addEventListener('mousemove', this.handleResizeMove, { passive: false })
    window.addEventListener('mouseup', this.handleResizeEnd)

    // Add a class to the body to change cursor during resize
    document.body.classList.add('resizing')
    if (this.vertical) {
      document.body.setAttribute('data-resize-vertical', 'true')
    }

    // Prevent text selection during resize
    e.preventDefault()
  }

  /**
   * Handles mouse movement during resize
   * Direct DOM updates for maximum responsiveness
   * @param e - The mouse move event
   */
  private handleResizeMove(e: MouseEvent) {
    if (!this.isResizing) return

    // Prevent default to avoid text selection
    e.preventDefault()

    let newSize: number

    if (this.vertical) {
      // Calculate new height for vertical resize
      const deltaY = this.startY - e.clientY
      newSize = Math.max(this.minHeight, Math.min(this.maxHeight, this.startHeight + deltaY))

      // Only update if height has changed
      if (newSize !== this.lastSize) {
        // Update the element height immediately
        this.element.style.height = `${newSize}px`
        this.lastSize = newSize

        // Call the onResize callback
        this.onResize(newSize)
      }
    } else {
      // Calculate new width for horizontal resize
      let deltaX = e.clientX - this.startX

      // Invert the direction if needed (for right panel)
      if (this.invertDirection) {
        deltaX = -deltaX
      }

      newSize = Math.max(this.minWidth, Math.min(this.maxWidth, this.startWidth + deltaX))

      // Only update if width has changed
      if (newSize !== this.lastSize) {
        // Update the element width immediately
        this.element.style.width = `${newSize}px`
        this.lastSize = newSize

        // Call the onResize callback
        this.onResize(newSize)
      }
    }
  }

  /**
   * Handles the end of a resize operation
   */
  private handleResizeEnd() {
    if (!this.isResizing) return

    this.isResizing = false

    // Remove event listeners
    window.removeEventListener('mousemove', this.handleResizeMove)
    window.removeEventListener('mouseup', this.handleResizeEnd)

    // Remove the resizing class from body
    document.body.classList.remove('resizing')
    if (this.vertical) {
      document.body.removeAttribute('data-resize-vertical')
    }

    // Restore transitions after resize is complete
    this.element.style.transition = ''

    // Get the final size and call the onResizeEnd callback
    const finalSize = this.vertical
      ? Number.parseInt(this.element.style.height || `${this.startHeight}`, 10)
      : Number.parseInt(this.element.style.width || `${this.startWidth}`, 10)

    this.onResizeEnd(finalSize)
  }

  /**
   * Cleans up event listeners
   * Call this when the component is being destroyed
   */
  public cleanup() {
    window.removeEventListener('mousemove', this.handleResizeMove)
    window.removeEventListener('mouseup', this.handleResizeEnd)
    document.body.classList.remove('resizing')
    document.body.removeAttribute('data-resize-vertical')
  }
}
