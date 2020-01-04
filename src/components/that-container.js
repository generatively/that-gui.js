import { LitElement, html, css } from 'lit-element'

class ThatContainer extends LitElement {
  constructor() {
    super()
  }

  render(){
    return html`
      <p>Gui Container</p>
      <slot></slot>
      <this-button>refresh</this-button>
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
      }
    `
  }
}

customElements.define('that-container', ThatContainer)