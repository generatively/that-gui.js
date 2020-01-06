import { LitElement, html, css } from 'lit-element'

class ThatContainer extends LitElement {
  constructor() {
    super()
  }

  render() {
    return html`
      <slot></slot>
    `
  }

  static get styles() {
    return css`
      :host {
        --padding: 5pt;
        display: block;
        padding: var(--padding);
        padding-top: 0;
        width: calc(100% - 2 * var(--padding));
        height: calc(100% - 2 * var(--padding));
        overflow: auto;
        outline: 1pt solid #ddd;
      }

      :host::-webkit-scrollbar {
        width: 10px;
      }

      :host::-webkit-scrollbar-track {
        background: #efefef;
      }

      :host::-webkit-scrollbar-thumb {
        background: #aaa;
      }

      :host::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
    `
  }
}

customElements.define('that-container', ThatContainer)
