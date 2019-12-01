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
      <div>
        <p>Gui Container</p>
        <slot></slot>
        ${true ? html`<this-button>refresh</this-button>` : ``}
      </div>
    `
  }

  static get styles() {
    return css`
      :host {
        --padding: 20pt;
      }
      div {
        padding: var(--padding);
        width: calc(100% - 2 * var(--padding));
        height: calc(100% - 2 * var(--padding));
        overflow: auto;
      }
    `
  }
}

customElements.define('gui-container', GuiContainer)