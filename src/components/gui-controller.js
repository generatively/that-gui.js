import { LitElement, html, css } from 'lit-element'

class GuiController extends LitElement {
  
  static get properties() { return {
    label: {type: String},
    path: {type: String},
    controllerType: {type: String},
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
    return html`
    <div>
      <span title="${this.path}">${this.label}: ${this.value}</span>
      <br /><span>${this.controllerType}</span>
      min:<span>${this.min}</span>|step:<span>${this.step}</span>|max:<span>${this.max}</span>
      <slot></slot>
    </div>
    `
  }
}

customElements.define('gui-controller', GuiController)