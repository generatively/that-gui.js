import { LitElement, html, css } from 'lit-element'

class GuiContainer extends LitElement {
  constructor() {
    super()
    this.x = "50px"
  }

  static get properties ()  {return {
    x: {type: String}
  }}

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

  render(){
    return html`
      <div>
        <p>Gui Container</p>
        <slot></slot>
        ${true ? html`<button>hey</button>` : ``}
      </div>
    `
  }
}

customElements.define('gui-container', GuiContainer)