import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { buttonStyles } from './button.styles'

export type ButtonProps = {
  variant: 'primary' | 'secondary' | 'danger'
  size: 'small' | 'medium' | 'large'
}

@customElement('my-button')
export class MyButton extends LitElement {
  @property({ type: String }) variant: ButtonProps['variant'] = 'primary'
  @property({ type: String }) size: ButtonProps['size'] = 'medium'
  @property({ type: Boolean, reflect: true }) disabled = false

  private _handleClick(e: Event) {
    if (this.disabled) {
      e.preventDefault()
      return
    }
    this.dispatchEvent(
      new CustomEvent(':click', {
        bubbles: true,
        composed: true,
      }),
    )
  }

  render() {
    const classes = {
      button: true,
      [`button--${this.variant}`]: true,
      [`button--${this.size}`]: this.size !== 'medium',
      'button--disabled': this.disabled,
    }

    return html`
      <button
        class=${classMap(classes)}
        ?disabled=${this.disabled}
        @click=${this._handleClick}
        part="button"
      >
        <slot></slot>
      </button>
    `
  }

  static styles = [buttonStyles]
}
