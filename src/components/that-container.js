import { LitElement, html, css } from 'lit-element'

class ThatContainer extends LitElement {
  constructor() {
    super()
  }

  static get styles() {
    return css`
      :host {
        --padding: 20px;
        display: block;
        padding: var(--padding);
        width: calc(100% - 2 * var(--padding));
        height: calc(100% - 2 * var(--padding));
        overflow: auto;
        box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12),
          0 5px 5px -3px rgba(0, 0, 0, 0.2);
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
    `
  }

  render() {
    return html`
      <slot></slot>
    `
  }
}

customElements.define('that-container', ThatContainer)
