import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { noSelectStyles, scrollableStyles } from '#/styles/global.css'

/**
 * Chat panel content component
 * Displays chat interface for communication
 */
@customElement('panel-chat')
export class PanelChat extends LitElement {
  render() {
    return html`
      <div class="chat-panel-container">
        <span>This should be the chat interface</span>
      </div>
    `
  }

  static styles = [
    scrollableStyles,
    noSelectStyles,
    css`
      :host {
        display: block;
        height: 100%;
        width: 100%;
        overflow: hidden;
        box-sizing: border-box;
      }

      .chat-panel-container {
        height: 100%;
        width: 100%;
        display: flex;
        padding: 8px;
        flex-direction: column;
        box-sizing: border-box;
        overflow: hidden;
      }

      /* Ensure chat-panel fills the container properly */
      chat-panel {
        height: 100%;
        width: 100%;
        display: block;
        overflow: hidden;
        box-sizing: border-box;
      }
    `,
  ]
}

declare global {
  interface HTMLElementTagNameMap {
    'panel-chat': PanelChat
  }
}
