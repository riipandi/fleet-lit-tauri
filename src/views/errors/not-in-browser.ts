import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('error-browser')
export class ErrorBrowser extends LitElement {
  render() {
    return html`
      <div class="browser-notice">
        <div class="icon-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h2>Browser Not Supported</h2>
        <p>This application will not work in Browser.</p>
        <a href="fleet-lit://open" class="app-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          <span>Open the Fleet Lit Tauri</span>
        </a>
      </div>
    `
  }

  static styles = css`
    :host {
      display: flex;
      height: 100%;
      width: 100%;
      font-family: var(--font-sans);
    }

    .browser-notice {
      margin: auto;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 400px;
      animation: fadeIn 0.5s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .icon-container {
      color: var(--color-destructive);
      margin-bottom: 1rem;
    }

    h2 {
      margin: 0 0 0.5rem;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--color-foreground);
    }

    p {
      font-weight: 400;
    }

    .browser-notice p {
      margin: 0 0 1.5rem;
      font-size: 1rem;
      color: var(--color-muted-foreground);
      line-height: 1.5;
    }

    .app-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1.2rem;
      background-color: var(--color-primary);
      color: var(--color-primary-foreground);
      text-decoration: none;
      border-radius: var(--radius-md);
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .app-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .app-button:active {
      transform: translateY(0);
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'error-browser': ErrorBrowser
  }
}
