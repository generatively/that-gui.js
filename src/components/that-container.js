import { LitElement, html, css } from 'lit-element'

class ThatContainer extends LitElement {
  constructor() {
    super()
  }

  render() {
    return html`
      <p>Gui Container</p>
      <slot></slot>
      <that-button>refresh</that-button>
    `
  }

  static get styles() {
    return css`
      :host {
        --padding: 20pt;
        display: block;
        padding: var(--padding);
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
