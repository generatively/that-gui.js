import { LitElement, html, css } from 'lit-element'
import { store } from '../store'

class GuiController extends LitElement {
  
  static get properties() { return {
    label: {type: String},
    path: {type: String}
    // controllerType: {type: String},
    // value
    // min: {type: Number},
    // max: {type: Number},
    // step: {type: Number}
  }}

  static get styles() {
    return css`
      :host {
        font-family: Alata;
        display: block;
        margin: 5pt 0 0 5pt;
        border-left: 1pt solid #CCC;
      }

      div {
        padding: 5pt;
        height: 50pt;
      }
    `
  }

  render() {
    return html`
      <div title="${this.path}">
          ${this.label}: <slot name="form-component"></slot>
      </div>
      <slot></slot>
    `
  }

  firstUpdated(changedProperties) {
    this.appendFormComponent()
  }

  appendFormComponent() {
    let { value, label, ...controllerOptions } = store.getState().controllerReducer.controllers[this.path]

    if (value) {
      let formElem = document.createElement('input')
      switch (typeof value) {
        case 'number':
          formElem.type = "range"
          formElem.min = controllerOptions.min 
          formElem.max = controllerOptions.max 
          formElem.step = controllerOptions.step 
          formElem.value = value
          break
        case 'string':
          formElem.value = value
          break
        case 'boolean':
          formElem.type = "checkbox"
          formElem.checked = value
          break
        case 'function':
          formElem.type = "button"
          formElem.innerHTML = label
          formElem.onclick = value
          break
        case 'object':
          if (Array.isArray(value)) {
            formElem.value = value
          }
      }

      formElem.slot = "form-component"
      this.appendChild(formElem)
    }
  }
}

customElements.define('gui-controller', GuiController)