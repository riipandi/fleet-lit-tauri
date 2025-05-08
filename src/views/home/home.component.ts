import { invoke } from '@tauri-apps/api/core'
import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import tauriLogo from '~/assets/images/tauri.svg'
import typescriptLogo from '~/assets/images/typescript.svg'
import viteLogo from '~/assets/images/vite.svg'

@customElement('view-home')
export class ViewHome extends LitElement {
  @state() private greetMsg = ''
  @state() private inputValue = ''

  render() {
    return html`
      <div class="home-container">
        <div class="logo-section">
          <a href="https://vitejs.dev" target="_blank" class="logo-link">
            <img src=${viteLogo} class="logo vite" alt="Vite logo" />
          </a>
          <a href="https://tauri.app" target="_blank" class="logo-link">
            <img src=${tauriLogo} class="logo tauri" alt="Tauri logo" />
          </a>
          <a href="https://www.typescriptlang.org/docs" target="_blank" class="logo-link">
            <img
              src=${typescriptLogo}
              class="logo typescript"
              alt="typescript logo"
            />
          </a>
        </div>

        <h1 class="title">Welcome to Fleet Lit Tauri</h1>
        <p class="description">
          A modern desktop application built with Tauri, Lit, and TypeScript
        </p>

        <p>Click on the Tauri logo to learn more about the framework</p>

        <div class="input-group">
          <input
            id="greet-input"
            placeholder="Enter a name..."
            .value=${this.inputValue}
            @input=${this._handleInput}
            class="input"
          />
          <my-button
            size="medium"
            variant="primary"
            @:click=${this._greet}
            part="button"
          >
            Greet
          </my-button>
        </div>

        <p id="greet-msg" class="greet-message">${this.greetMsg}</p>
      </div>
    `
  }

  private _handleInput(e: Event) {
    this.inputValue = (e.target as HTMLInputElement).value
  }

  private async _greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    this.greetMsg = await invoke('greet', {
      name: this.inputValue,
    })
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      overflow: auto;
    }

    .home-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0;
      width: 100%;
      max-width: 800px;
      text-align: center;
      color: var(--color-foreground);
      margin: auto; /* Center vertically when content is shorter than viewport */
    }

    .logo-section {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .logo-link {
      display: inline-flex;
      transition: transform 0.2s ease;
    }

    .logo-link:hover {
      transform: scale(1.05);
    }

    .logo {
      height: 6rem;
      padding: 1.5rem;
      will-change: filter;
      transition: filter 300ms;
    }

    .logo:hover {
      filter: drop-shadow(0 0 2em var(--color-primary));
    }

    .logo.vite:hover {
      filter: drop-shadow(0 0 2em #747bff);
    }

    .logo.tauri:hover {
      filter: drop-shadow(0 0 2em #24c8db);
    }

    .logo.typescript:hover {
      filter: drop-shadow(0 0 2em #3178c6);
    }

    .title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: var(--color-foreground);
    }

    .description {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      color: var(--color-muted-foreground);
    }

    .input-group {
      display: flex;
      gap: 0.5rem;
      margin: 1.5rem 0;
      width: 100%;
      max-width: 500px;
    }

    .input {
      flex: 1;
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: var(--color-background);
      color: var(--color-foreground);
      transition: all 0.25s;
    }

    .input:focus {
      outline: 4px auto var(--color-ring);
      border-color: var(--color-primary);
    }

    .greet-message {
      margin-top: 1rem;
      color: var(--color-primary);
      font-weight: 500;
      min-height: 1.5em;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .logo-section {
        flex-direction: column;
        gap: 1rem;
      }

      .logo {
        height: 4rem;
        padding: 1rem;
      }

      .title {
        font-size: 2rem;
      }

      .input-group {
        flex-direction: column;
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'view-home': ViewHome
  }
}
