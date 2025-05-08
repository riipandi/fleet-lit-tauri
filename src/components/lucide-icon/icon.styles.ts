import { css } from 'lit'

export const iconStyles = css`
  :host {
    display: inline-flex;
    line-height: 0;
  }

  :host svg {
    display: block;
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  :host .lucide-icon {
    vertical-align: middle;
  }
`
