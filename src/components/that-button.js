import { LitElement, html, css } from 'lit-element'
import { mainStyle } from '../styles'

class ThatButton extends LitElement {

  render() {
    return html`
      <slot></slot>
    `
  }

  static get styles() {
    return [mainStyle, css`
      :host {
        cursor: pointer;
        user-select: none;
        display: inline-block;
        border: 1pt solid var(--primary-color);
        color: var(--text-color);
        padding: 5pt;
        text-align: center;
        vertical-align: middle;
        font-size: 12pt;
        font-family: var(--font-family);
        border-radius: 5pt;
        transition: box-shadow 0.1s;
      }
      
      :host(:hover) {
        box-shadow: 0 0 4pt #555;
      }

      :host(:active) {
        background: var(--secondary-color);
      }
    `]
  }
}

customElements.define('that-button', ThatButton)