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

  // appendFormComponent() {
  //   switch (this.controllerType){
  //     case 'function':
  //       const button = document.createElement('this-button')
  //       button.innerHTML = this.label
  //       button.onclick = this.value
  //       button.slot = "form-component"
  //       this.appendChild(button)
  //     case undefined:
  //       return
  //   }
  // }

  static get styles() {
    return css`
      :host {
        font-family: Alata;
        display: block;
        padding-bottom: 5pt;
      }

      .container-main {
        margin: 5pt 2pt 0 5pt;
        padding: 0.01pt;
        border-radius: 10pt;
        box-shadow: 0 0 0 1pt #CCC;
      }

      .container-controller {
        padding: 5pt;
        height: 50pt;
        border-radius: 10pt;
        /* box-shadow: 0 2pt 2pt -1pt #CCC; */
      }
    `
  }
}

customElements.define('gui-controller', GuiController)