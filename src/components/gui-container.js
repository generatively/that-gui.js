import { LitElement, html } from 'lit-element'

class GuiContainer extends LitElement {
  render(){
    return html`
      <div>
        <p>Gui Container</p>
        <slot></slot>
      </div>
    `
  }
}

customElements.define('gui-container', GuiContainer)