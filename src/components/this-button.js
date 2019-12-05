import { LitElement, html, css } from 'lit-element'
// import { store } from '../store'
import { mainStyle } from '../styles'

class ThisButton extends LitElement {

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
        margin: 5pt;
        display: inline-block;
        background: var(--primary-color);
        color: var(--text-color);
        padding: 12pt;
        text-align: center;
        vertical-align: middle;
        font-size: 12pt;
        font-family: var(--font-family);
        border-radius: 100vmax;
        box-shadow: 0 0 3pt -2pt var(--primary-color), 0 0 2pt -1pt #0003;
        transition: transform 0.2s, box-shadow 0.3s;
      }
      
      :host(:hover) {
        box-shadow: 0 0 10pt -3pt var(--primary-color), 0 0 10pt -1pt #0003;
      }

      :host(:active) {
        box-shadow: 0 0 10pt -1pt var(--primary-color), 0 0 10pt -1pt #0003;
        background: white;
      }
    `]
  }
}

customElements.define('this-button', ThisButton)