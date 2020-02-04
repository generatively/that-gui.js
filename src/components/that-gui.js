import { LitElement, html, css } from 'lit-element'

class ThatGui extends LitElement {
  constructor() {
    super()
    this.hasParent = false
  }

  static get properties() {
    return {
      hasParent: { type: Boolean, reflect: true },
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
        position: relative;
        overflow: auto;
        height: calc(100vh - 40px);
        width: 500px;
        float: right;
        padding: 20px;
        font-family: Helvetica, Arial, sans-serif;
        box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12),
          0 5px 5px -3px rgba(0, 0, 0, 0.2);
      }

      :host[hasParent] {
        width: calc(100% - 40px);
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

customElements.define('that-gui', ThatGui)
