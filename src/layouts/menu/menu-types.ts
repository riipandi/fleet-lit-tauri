/**
 * Interface for menu item configuration
 * Supports nested menus, separators, and actions
 */
export interface MenuItem {
  /**
   * Unique identifier for the menu item
   */
  id: string

  /**
   * Display text for the menu item
   */
  label: string

  /**
   * Optional keyboard shortcut to display
   */
  shortcut?: string

  /**
   * Optional icon to display (can be HTML string or component)
   */
  icon?: string | HTMLElement

  /**
   * Whether this item is a separator
   */
  separator?: boolean

  /**
   * Whether this item is disabled
   */
  disabled?: boolean

  /**
   * Action to execute when the item is clicked
   */
  action?: () => void

  /**
   * Child menu items for submenus
   */
  children?: MenuItem[]
}
