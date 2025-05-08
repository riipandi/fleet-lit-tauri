import type { MyButton } from './button.component'

declare global {
  interface HTMLElementTagNameMap {
    'my-button': MyButton
  }
}

export * from './button.component'
