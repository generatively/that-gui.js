import { LitElement, html, css } from 'lit-element'
import { classMap } from 'lit-html/directives/class-map'

class ThatGuiComponent extends LitElement {
  constructor() {
    super()
    this.hasParent = false
  }

  static get properties() {
    return {
      hasParent: { type: Boolean },
    }
  }

  static get styles() {
    return css`
      :host {
        font-family: Helvetica, Arial, sans-serif;
      }

      .container {
        position: absolute;
        overflow-y: scroll;
        top: 0;
        right: 0;
        display: block;
        box-sizing: border-box;
        width: 100%;
        height: calc(100vh - 40px);
        box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
        padding: 20px;
      }

      .container--has-parent {
        position: unset;
        top: unset;
        right: unset;
        width: 100%;
        height: 100%;
        box-shadow: none;
      }

      .container::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }

      .container::-webkit-scrollbar-track {
        background: #efefef;
      }

      .container::-webkit-scrollbar-thumb {
        background: #aaa;
      }
    `
  }

  render() {
    return html`
      <div class=${classMap({ container: true, 'container--has-parent': this.hasParent })}>
        <slot></slot>
      </div>
    `
  }
}

customElements.define('that-gui', ThatGuiComponent)
