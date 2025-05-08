import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { noSelectStyles, scrollableStyles } from '#/styles/global.css'

/**
 * Search panel content component
 * Displays search functionality and results
 */
@customElement('panel-search')
export class PanelSearch extends LitElement {
  render() {
    return html`
      <div class="search-container no-select">
        <div class="search-input-container">
          <input
            type="text"
            placeholder="Search in project..."
            class="search-input"
          />
          <button class="search-button">
            <lucide-icon name="search" size="14"></lucide-icon>
          </button>
        </div>
        <div class="search-options">
          <div class="search-option">
            <input type="checkbox" id="case-sensitive" />
            <label for="case-sensitive">Match Case</label>
          </div>
          <div class="search-option">
            <input type="checkbox" id="whole-word" />
            <label for="whole-word">Whole Word</label>
          </div>
          <div class="search-option">
            <input type="checkbox" id="regex" />
            <label for="regex">Use Regex</label>
          </div>
        </div>
        <div class="search-results">
          <div class="search-placeholder">
            Type to search in project files
          </div>
        </div>
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
      }

      .search-container {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .search-input-container {
        display: flex;
        margin-bottom: 8px;
      }

      .search-input {
        flex: 1;
        background-color: var(--color-sidebar-input);
        border: 1px solid var(--color-sidebar-border);
        color: var(--color-sidebar-foreground);
        border-radius: var(--radius-sm);
        padding: 4px 8px;
        font-size: 12px;
        outline: none;
      }

      .search-input:focus {
        border-color: var(--color-primary);
      }

      .search-button {
        margin-left: 4px;
        background-color: var(--color-sidebar-primary);
        color: var(--color-sidebar-primary-foreground);
        border: none;
        border-radius: var(--radius-sm);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 8px;
      }

      .search-options {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 8px;
        font-size: 12px;
      }

      .search-option {
        display: flex;
        align-items: center;
      }

      .search-option input {
        margin-right: 4px;
      }

      .search-results {
        flex: 1;
        overflow: auto;
      }

      .search-placeholder {
        color: var(--color-muted-foreground);
        font-style: italic;
        font-size: 12px;
        text-align: center;
        padding: 16px 0;
      }
    `,
  ]
}

declare global {
  interface HTMLElementTagNameMap {
    'panel-search': PanelSearch
  }
}
