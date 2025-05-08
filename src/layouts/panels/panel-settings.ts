import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { noSelectStyles, scrollableStyles } from '#/styles/global.css'

/**
 * Settings panel content component
 * Displays application settings and preferences
 */
@customElement('panel-settings')
export class PanelSettings extends LitElement {
  render() {
    return html`
      <div class="settings-container no-select">
        <div class="settings-section scrollable">
          <h3 class="section-title">Editor</h3>

          <div class="setting-item">
            <div class="setting-label">Font Size</div>
            <div class="setting-control">
              <input type="number" min="8" max="32" value="14" class="number-input" />
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-label">Tab Size</div>
            <div class="setting-control">
              <select class="select-input">
                <option value="2">2</option>
                <option value="4" selected>4</option>
                <option value="8">8</option>
              </select>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-label">Word Wrap</div>
            <div class="setting-control">
              <label class="toggle">
                <input type="checkbox" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div class="settings-section">
          <h3 class="section-title">Appearance</h3>

          <div class="setting-item">
            <div class="setting-label">Theme</div>
            <div class="setting-control">
              <select class="select-input">
                <option value="light">Light</option>
                <option value="dark" selected>Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-label">Show Line Numbers</div>
            <div class="setting-control">
              <label class="toggle">
                <input type="checkbox" checked />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-label">Minimap</div>
            <div class="setting-control">
              <label class="toggle">
                <input type="checkbox" checked />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div class="settings-section">
          <h3 class="section-title">Terminal</h3>

          <div class="setting-item">
            <div class="setting-label">Shell Path</div>
            <div class="setting-control">
              <input type="text" value="/bin/bash" class="text-input" />
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-label">Font Family</div>
            <div class="setting-control">
              <select class="select-input">
                <option value="monospace" selected>Monospace</option>
                <option value="consolas">Consolas</option>
                <option value="menlo">Menlo</option>
              </select>
            </div>
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

      .settings-container {
        height: 100%;
        overflow: auto;
      }

      .settings-section {
        margin-bottom: 16px;
      }

      .section-title {
        font-size: 14px;
        font-weight: 600;
        margin: 0 0 8px 0;
        padding-bottom: 4px;
        border-bottom: 1px solid var(--color-sidebar-border);
        color: var(--color-sidebar-foreground);
      }

      .setting-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 0;
        font-size: 12px;
      }

      .setting-label {
        color: var(--color-sidebar-foreground);
      }

      .setting-control {
        display: flex;
        align-items: center;
      }

      .number-input,
      .select-input,
      .text-input {
        background-color: var(--color-sidebar-input);
        border: 1px solid var(--color-sidebar-border);
        color: var(--color-sidebar-foreground);
        border-radius: var(--radius-sm);
        padding: 4px;
        font-size: 12px;
        outline: none;
      }

      .number-input {
        width: 50px;
      }

      .text-input {
        width: 150px;
      }

      .toggle {
        position: relative;
        display: inline-block;
        width: 36px;
        height: 18px;
      }

      .toggle input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--color-sidebar-border);
        transition: .3s;
        border-radius: 34px;
      }

      .toggle-slider:before {
        position: absolute;
        content: "";
        height: 14px;
        width: 14px;
        left: 2px;
        bottom: 2px;
        background-color: var(--color-sidebar-foreground);
        transition: .3s;
        border-radius: 50%;
      }

      .toggle input:checked + .toggle-slider {
        background-color: var(--color-sidebar-primary);
      }

      .toggle input:checked + .toggle-slider:before {
        transform: translateX(18px);
      }
    `,
  ]
}

declare global {
  interface HTMLElementTagNameMap {
    'panel-settings': PanelSettings
  }
}
