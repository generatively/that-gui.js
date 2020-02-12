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
        position: absolute;
        top: 0;
        right: 0;
        display: block;
        overflow: auto;
        width: calc(100% - 40px);
        height: calc(100vh - 40px);
        font-family: Helvetica, Arial, sans-serif;
        box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
        padding: 20px;
      }

      :host[hasParent] {
        position: unset;
        top: unset;
        right: unset;
        width: 100%;
        height: 100%;
        box-shadow: none;
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
