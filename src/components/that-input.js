import { LitElement, html, css, unsafeCSS } from 'lit-element'
import { classMap } from 'lit-html/directives/class-map'
import { mainStyle } from '../styles/index'

class ThatInput extends LitElement {
  constructor() {
    super()
    this.value = ''
  }

  static get properties() {
    return {
      value: {},
      label: { type: String },
      type: { type: String },
      // onChange: { type: Object },
      min: { type: Number },
      max: { type: Number },
      helpText: { type: String },
      errorText: { type: String },
      leadingIcon: { type: String },
      trailingIcon: { type: String },
    }
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }

      .text-field {
        position: relative;
        box-sizing: border-box;
        width: 280px;
        height: 56px;
        border-radius: 4px 4px 0 0;
        border-bottom: 1px solid ${unsafeCSS(mainStyle.onSurface)}99;
        background: ${unsafeCSS(mainStyle.onSurface)}0a;
        transition: border 0.2s, background-color 0.2s;
      }

      .text-field:hover {
        background: ${unsafeCSS(mainStyle.onSurface)}10;
      }

      .text-field:focus-within {
        background: ${unsafeCSS(mainStyle.onSurface)}1a;
        border-bottom: 2px solid ${unsafeCSS(mainStyle.primary)}99;
      }

      .text-field__input {
        position: absolute;
        top: 20px;
        left: 12px;
        width: 100%;
        height: calc(100% - 20px);
        font-family: ${unsafeCSS(mainStyle.fontFamily)};
        font-size: 16px;
        color: ${unsafeCSS(mainStyle.onSurface)}de;
        border: none;
        background: none;
      }

      .text-field__input:focus {
        outline: none;
      }

      .text-field__label {
        position: absolute;
        top: 50%;
        left: 12px;
        transform: translateY(-50%);
        font-size: 16px;
        color: ${unsafeCSS(mainStyle.onSurface)}99;
        transition: top 0.2s, transform 0.2s, font-size 0.2s;
      }

      .text-field__input:focus + .text-field__label,
      .text-field__label--float {
        top: 18px;
        transform: translateY();
        font-size: 12px;
        line-height: 20px;
        color: ${unsafeCSS(mainStyle.primary)};
      }
    `
  }

  render() {
    return html`
      <div class=${classMap({ 'text-field': true })}>
        <input
          value=${this.value}
          @change=${event => {
            this.value = event.srcElement.value
            this.dispatchEvent(new Event('change'))
          }}
          class=${classMap({ 'text-field__input': true })}
        />
        <label class=${classMap({ 'text-field__label': true, 'text-field__label--float': this.value != '' })}
          >${this.label}</label
        >
      </div>
      <div class=${classMap({ 'helper-text': true })}>${this.helpText}</div>
    `
  }
}

customElements.define('that-input', ThatInput)
