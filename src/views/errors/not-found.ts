import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('page-not-found')
export class PageNotFound extends LitElement {
  render() {
    return html`
      <div class="not-found-container">
        <h1 class="error-code">404</h1>
        <h2 class="error-title">Page Not Found</h2>
        <p class="error-message">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <div class="action-container">
          <a href="/" class="back-button" @click=${this._handleHomeClick}>
            Back to Home
          </a>
        </div>
      </div>
    `
  }

  private _handleHomeClick(e: Event) {
    e.preventDefault()
    // Dispatch custom event to be listened by my-app
    this.dispatchEvent(
      new CustomEvent('navigate', {
        bubbles: true,
        composed: true,
        detail: { path: '/' },
      }),
    )
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .not-found-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem;
      min-height: 100vh;
      width: 100%;
      box-sizing: border-box;
      background-color: var(--color-background);
      color: var(--color-foreground);
    }

    .error-code {
      /* Responsive font size */
      font-size: clamp(6rem, 15vw, 8rem);
      font-weight: 700;
      margin: 0;
      color: var(--color-destructive);
      line-height: 1;
    }

    .error-title {
      /* Responsive font size */
      font-size: clamp(1.5rem, 5vw, 2.5rem);
      margin: 1rem 0;
      color: var(--color-foreground);
    }

    .error-message {
      /* Responsive font size */
      font-size: clamp(1rem, 3vw, 1.2rem);
      margin-bottom: 2rem;
      max-width: 100%;
      width: 600px;
      color: var(--color-muted-foreground);
    }

    .action-container {
      margin-top: 1rem;
    }

    .back-button {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background-color: var(--color-primary);
      color: var(--color-primary-foreground);
      text-decoration: none;
      border-radius: var(--radius-lg);
      font-weight: 500;
      transition: background-color 0.3s ease;
    }

    .back-button:hover {
      filter: brightness(1.1);
      cursor: pointer;
    }

    /* Media queries for better responsiveness */
    @media (max-width: 768px) {
      .not-found-container {
        padding: 1rem;
      }
      .error-message {
        width: 100%;
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'page-not-found': PageNotFound
  }
}
