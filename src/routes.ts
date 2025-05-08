import { Routes } from '@lit-labs/router'
import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

// Polyfills URLPattern to handle better borwsers compatibility.
// @see: https://developer.mozilla.org/en-US/docs/Web/API/URLPattern#browser_compatibility
// @ts-ignore: Property 'UrlPattern' does not exist
import 'urlpattern-polyfill'

@customElement('my-app')
export class MyApp extends LitElement {
  private _routes = new Routes(
    this,
    [
      {
        path: '/',
        render: () =>
          html`
            <root-layout @navigate=${this._onNavigate}>
              <view-home></view-home>
            </root-layout>
          `,
      },
      {
        path: '/projects',
        render: () => html`
					<root-layout @navigate=${this._onNavigate}>
						<h1>Projects</h1>
					</root-layout>
				`,
      },
      {
        path: '/about',
        render: () => html`
					<root-layout @navigate=${this._onNavigate}>
						<h1>About</h1>
					</root-layout>
				`,
      },
    ],
    {
      fallback: {
        render: () => html` <page-not-found @navigate=${this._onNavigate}></page-not-found>`,
      },
    },
  )

  render() {
    // Make sure the app is only rendered in Tauri environment.
    // If __TAURI__ doesn't exist, render the error browser view.
    return import.meta.env.PROD && !('__TAURI__' in window)
      ? html`<error-browser></error-browser>`
      : this._routes.outlet()
  }

  private _onNavigate(e: CustomEvent) {
    const path = e.detail.path
    this._routes.goto(path)
    window.history.pushState(null, '', path)
  }

  connectedCallback() {
    super.connectedCallback()

    // Handle the back/forward browser navigation
    window.addEventListener('popstate', () => this.requestUpdate())

    // Make sure the initial route is correctly rendered.
    // If the URL is currently empty or /, point to the home route.
    if (window.location.pathname === '/' || window.location.pathname === '') {
      this._routes.goto('/')
    } else {
      // If other urls, navigate to the URL
      this._routes.goto(window.location.pathname)
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    window.removeEventListener('popstate', () => this.requestUpdate())
  }

  static styles = css`
    :host {
      display: flex;
      height: 100vh;
      background-color: var(--color-background);
      color: var(--color-foreground);
      font-family: var(--font-sans);
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'my-app': MyApp
  }
}
