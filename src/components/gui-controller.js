import { LitElement, html, css } from 'lit-element'

export class GuiController extends LitElement {
  
  static get properties() { return {
    key: {type: String},
    path: {type: String},
    type: {type: String},
    value: {},
    min: {type: Number},
    max: {type: Number},
    step: {type: Number}
  }}

  static get styles() {
    return css`
      div {
        border: solid black;
        border-width: 0 0 5px 5px;
        padding-left: 10px;
        margin-bottom: 10px;
      }
    `
  }

  render() {
    console.log(this.key)
    return html`
    <div>
      <span title="${this.path}">${this.key}: ${this.value}</span>
      <slot></slot>
    </div>
    `
  }
}

customElements.define('gui-controller', GuiController)