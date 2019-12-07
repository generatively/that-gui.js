import { LitElement, html, css } from 'lit-element'

class GuiController extends LitElement {
  
  static get properties() { return {
    label: {type: String},
    path: {type: String},
    // controllerType: {type: String},
    // value: {},
    // min: {type: Number},
    // max: {type: Number},
    // step: {type: Number}
  }}

  static get styles() {
    return css`
      :host {
        font-family: Alata;
        display: block;
        padding-bottom: 2pt;
      }

      .container-main {
        margin: 5pt 2pt 0 5pt;
        border-radius: 10pt;
        box-shadow: 0 0 0 1pt #CCC;
      }

      .container-controller {
        padding: 5pt;
        height: 50pt;
        border-radius: 10pt;
      }
    `
  }

  render() {
    return html`
      <div class="container-main">
        <div class="container-controller">
          <span title="${this.path}">
            ${this.label}: <slot name="form-component"></slot>
          </span>
        </div>
        <slot></slot>
      </div>
    `
  }
}

customElements.define('gui-controller', GuiController)