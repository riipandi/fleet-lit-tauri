import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js'
import * as icons from 'lucide'
import { type SVGProps, createElement } from 'lucide'
import { iconStyles } from './icon.styles'
import type { LucideIconName } from './icon.types'

// Cache to store already imported icons
const iconCache: Record<string, string> = {}

/**
 * Lucide Icon Web Component
 *
 * A lightweight, customizable icon component that renders Lucide icons.
 *
 * @element lucide-icon
 *
 * @prop {string} name - The name of the icon to display (in kebab-case)
 * @prop {string} [size=24] - The size of the icon
 * @prop {string} [color=currentColor] - The color of the icon
 * @prop {string} [stroke-width=2] - The stroke width of the icon
 * @prop {string} [class] - Additional CSS classes
 * @prop {string} [stroke-linecap=round] - The stroke linecap of the icon
 * @prop {string} [stroke-linejoin=round] - The stroke linejoin of the icon
 *
 * @example
 * <lucide-icon
 *   name="arrow-left"
 *   size="24"
 *   stroke-width="2"
 *   class="custom-class"
 *   aria-label="Go back"
 *   data-testid="back-icon"
 * ></lucide-icon>
 */
@customElement('lucide-icon')
export class LucideIcon extends LitElement {
  /**
   * The name of the icon to display (in kebab-case)
   */
  @property({ type: String }) name!: LucideIconName

  /**
   * The size of the icon
   */
  @property({ type: String }) size = '24'

  /**
   * The color of the icon
   */
  @property({ type: String }) color = 'currentColor'

  /**
   * The stroke width of the icon
   */
  @property({ type: String, attribute: 'stroke-width' }) strokeWidth = '2'

  /**
   * Additional CSS classes
   */
  @property({ type: String }) class = ''

  /**
   * The stroke linecap of the icon
   */
  @property({ type: String, attribute: 'stroke-linecap' }) strokeLinecap = 'round'

  /**
   * The stroke linejoin of the icon
   */
  @property({ type: String, attribute: 'stroke-linejoin' }) strokeLinejoin = 'round'

  /**
   * Get all attributes to pass to the SVG
   */
  private _getSvgAttributes(): SVGProps {
    // Make sure to convert string values to numbers where appropriate
    const strokeWidthValue = Number.parseFloat(this.strokeWidth) || 2
    const sizeValue = Number.parseFloat(this.size) || 24

    const attrs: SVGProps = {
      width: sizeValue,
      height: sizeValue,
      stroke: this.color,
      'stroke-width': strokeWidthValue, // Use kebab-case for direct attribute setting
      'stroke-linecap': this.strokeLinecap,
      'stroke-linejoin': this.strokeLinejoin,
      class: `lucide-icon ${this.class}`.trim(),
    }

    // Add all other attributes from the element to the SVG
    const attributesList = Array.from(this.attributes)
    for (const attr of attributesList) {
      const name = attr.name
      // Skip standard properties we already handle
      if (
        name !== 'name' &&
        name !== 'size' &&
        name !== 'color' &&
        name !== 'stroke-width' &&
        name !== 'class' &&
        name !== 'stroke-linecap' &&
        name !== 'stroke-linejoin' &&
        !name.startsWith('on') // Skip event handlers
      ) {
        // Keep the original attribute name for SVG attributes
        ;(attrs as Record<string, string | number>)[name] = attr.value
      }
    }

    return attrs
  }

  /**
   * Get an icon by name
   */
  private _getIcon(name: LucideIconName): string {
    const cacheKey = `${name}-${this.size}-${this.color}-${this.strokeWidth}-${this.strokeLinecap}-${this.strokeLinejoin}-${this.class}`

    // Return from cache if available
    if (iconCache[cacheKey]) {
      return iconCache[cacheKey]
    }

    // Convert kebab-case to PascalCase
    const pascalCaseName = name
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')

    // Get the icon from lucide
    const iconData = (icons as Record<string, any>)[pascalCaseName]

    if (!iconData) {
      console.error(`Icon not found: ${name}`)
      return ''
    }

    try {
      // Create SVG element with all attributes
      const element = createElement(iconData, this._getSvgAttributes())

      // Convert element to string
      const svgString = element.outerHTML

      // Cache the icon
      iconCache[cacheKey] = svgString

      return svgString
    } catch (error) {
      console.error(`Failed to create icon: ${name}`, error)
      return ''
    }
  }

  render() {
    if (!this.name) {
      console.warn('Icon name is required')
      return html``
    }

    const svgString = this._getIcon(this.name)

    if (!svgString) {
      return html``
    }

    return unsafeSVG(svgString)
  }

  static styles = [iconStyles]
}
