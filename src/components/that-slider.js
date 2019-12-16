import { LitElement, html, css } from 'lit-element'

class ThatSlider extends LitElement {

  static get properties () {
    return {
      value: {},
      min: {type: Number},
      max: {type: Number},
      step: {type: Number},
      label: {type: String}
    }
  }

  render() {
    return html`
      <svg>
        <line>
      </svg>
    `
  }

  static get styles() {
    return css`
      /* :host {
        
      }
      
      :host(:hover) {
        
      }

      :host(:active) {
        
      } */
    `
  }
}

customElements.define('that-slider', ThatSlider)