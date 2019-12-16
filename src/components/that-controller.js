import { LitElement, html, css } from 'lit-element'
import { store } from '../store'
import { updateController } from '../actions'

class ThatController extends LitElement {
  
  static get properties() { 
    return {
      label: {type: String},
      path: {type: String},
      hasValue: {type: Boolean}
    }
  }

  static get styles() {
    return css`
      :host {
        font-family: Alata;
        display: block;
        margin-left: 5pt;
        border-left: 1pt solid #CCC;
      }

      div {
        padding: 5pt;
      }
    `
  }

  render() {
    return html`
      <div title="${this.path}">
        ${this.label}: ${this.appendFormComponent()}
        <button>settings</button>${this.hasValue ? html`<button>reset</button><button>randomise</button>`:``}
      </div>
      <slot></slot>
    `
  }


  appendFormComponent() {
    let { value, label, ...controllerOptions } = store.getState().controllerReducer.controllers[this.path]
    if (value != undefined) {
      const type = typeof value
      if (type === 'function') {
      return html`<input type='button' value=${this.label} @click="${value}">`
      } else {
        switch (type) {
          case 'number':
            return html`${value}: <input 
              type='range'
              value=${value}
              min=${controllerOptions.min || 0}
              max=${controllerOptions.max || controllerOptions.initialValue > 1 ? Math.pow(10, controllerOptions.initialValue.toString().length) : 1}
              step=${controllerOptions.step || controllerOptions.initialValue > 1 ? 1 : 0.001}
              @change=${event => {store.dispatch(updateController(this.path, {value: Number(event.srcElement.value)}))}}
            >`
          case 'string':
            return html`<input 
              value=${value}
              @change=${event => {store.dispatch(updateController(this.path, {value: event.srcElement.value}))}}
            >`
          case 'boolean':
            return html`<input 
              type='checkbox' 
              ?checked=${value}
              @change=${event => {store.dispatch(updateController(this.path, {value: event.srcElement.checked}))}}
            >`
          case 'object':
            if (Array.isArray(value)) {
              return html`<input 
                value=${value.toString()}
                @change=${event => {store.dispatch(updateController(this.path, {value: event.srcElement.value.split(",")}))}}
              >`
            }
          default:
            return html`<span style="color: red;">ERROR: Controller type not supported</span>`
        }
      }
    }
  }
}

customElements.define('that-controller', ThatController)