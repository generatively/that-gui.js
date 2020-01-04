import { LitElement, html, css } from 'lit-element'

class ThatInput extends LitElement {

  static get properties () {
    return {
      value: {},
      label: {type: String}
    }
  }

  render() {
    return html`
      <input value=${this.value} @change=${this.onchange}>
    `
  }
}

customElements.define('that-input', ThatInput)