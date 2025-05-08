import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { noSelectStyles } from '#/styles/global.css'

/**
 * Explorer panel content component
 * Displays project files and folders
 */
@customElement('panel-explorer')
export class PanelExplorer extends LitElement {
  render() {
    return html`
      <div class="explorer-container no-select">
        <div class="section-header">
          <span>EXPLORER</span>
        </div>
        <div class="project-tree">
          <div class="folder-item expanded">
            <div class="folder-header">
              <lucide-icon name="chevron-down" size="14"></lucide-icon>
              <lucide-icon name="folder-open" size="16"></lucide-icon>
              <span>project-name</span>
            </div>
            <div class="folder-content">
              <div class="file-item">
                <lucide-icon name="file-text" size="16"></lucide-icon>
                <span>README.md</span>
              </div>
              <div class="file-item">
                <lucide-icon name="file-json" size="16"></lucide-icon>
                <span>package.json</span>
              </div>
              <div class="folder-item">
                <div class="folder-header">
                  <lucide-icon name="chevron-right" size="14"></lucide-icon>
                  <lucide-icon name="folder" size="16"></lucide-icon>
                  <span>src</span>
                </div>
              </div>
              <div class="folder-item">
                <div class="folder-header">
                  <lucide-icon name="chevron-right" size="14"></lucide-icon>
                  <lucide-icon name="folder" size="16"></lucide-icon>
                  <span>public</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }

  static styles = [
    noSelectStyles,
    css`
      :host {
        display: block;
        height: 100%;
      }

      .explorer-container {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .section-header {
        font-size: 11px;
        text-transform: uppercase;
        color: var(--color-sidebar-foreground);
        opacity: 0.7;
        margin-bottom: 8px;
        font-weight: 600;
      }

      .project-tree {
        font-size: 13px;
      }

      .folder-item, .file-item {
        cursor: pointer;
      }

      .folder-header, .file-item {
        display: flex;
        align-items: center;
        padding: 2px 0;
        border-radius: var(--radius-sm);
      }

      .folder-header:hover, .file-item:hover {
        background-color: var(--color-sidebar-hover);
      }

      .folder-content {
        padding-left: 16px;
      }

      .folder-item.expanded > .folder-header > lucide-icon:first-child {
        transform: rotate(0deg);
      }

      lucide-icon {
        margin-right: 4px;
        color: var(--color-sidebar-icon);
      }

      lucide-icon[name="chevron-right"],
      lucide-icon[name="chevron-down"] {
        min-width: 14px;
      }

      .folder-item:not(.expanded) > .folder-content {
        display: none;
      }
    `,
  ]
}

declare global {
  interface HTMLElementTagNameMap {
    'panel-explorer': PanelExplorer
  }
}
