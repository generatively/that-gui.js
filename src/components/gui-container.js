import { LitElement, html, css } from 'lit-element'

class GuiContainer extends LitElement {
  constructor() {
    super()
    this.x = "50px"
  }

  static get properties ()  {return {
    x: {type: String}
  }}

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
        display: block;
        --padding: 20pt;
        padding: var(--padding);
        width: calc(100% - 2 * var(--padding));
        height: calc(100% - 2 * var(--padding));
        overflow: auto;
      }
    `
  }
}

customElements.define('gui-container', GuiContainer)