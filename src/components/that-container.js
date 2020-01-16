import { LitElement, html, css } from 'lit-element'

class ThatContainer extends LitElement {
  constructor() {
    super()
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 20px;
        height: calc(100% - 40px);
        width: calc(100% - 40px);
        overflow: auto;
        box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12),
          0 5px 5px -3px rgba(0, 0, 0, 0.2);
        font-family: Helvetica, Arial, sans-serif;
      }

      :host::-webkit-scrollbar {
        width: 10px;
        height: 10px;
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
      <div>
        <slot></slot>
      </div>
    `
  }
}

customElements.define('that-gui', ThatContainer)
