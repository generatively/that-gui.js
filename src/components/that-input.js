import { LitElement, html, css } from 'lit-element'
import { classMap } from 'lit-html/directives/class-map'
import { theme } from '../styles/index'

class ThatInput extends LitElement {
  constructor() {
    super()
  }

  static get properties() {
    return {
      value: {},
      label: { type: String },
      type: { type: String },
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
        font-size: 1em;
        width: 17.5em;
        margin: 0 0.3em;
      }

      .text-field {
        position: relative;
        box-sizing: border-box;
        height: 3.5em;
        border-radius: 0.25em 0.25em 0 0;
        border-bottom: 0.0625em solid rgba(var(--on-surface), 0.6);
        background: rgba(var(--on-surface), 0.039);
        transition: border 0.2s, background-color 0.2s;
      }

      .text-field:hover {
        background: rgba(var(--on-surface), 0.063);
      }

      .text-field:focus-within {
        background: rgba(var(--on-surface), 0.102);
        border-bottom: 0.125em solid rgba(var(--primary), 0.6);
      }

      .text-field__input {
        position: absolute;
        top: 1.25em;
        left: 0.54em;
        width: calc(100% - 1.08em);
        height: calc(100% - 1.25em);
        font-size: inherit;
        color: rgba(var(--on-surface), 0.871);
        border: none;
        background: none;
      }

      .text-field__input:focus {
        outline: none;
      }

      .text-field__label {
        position: absolute;
        top: 50%;
        left: 0.75em;
        transform: translateY(-50%);
        color: rgba(var(--on-surface), 0.6);
        transition: top 0.2s, transform 0.2s, font-size 0.2s;
      }

      .text-field__input:focus + .text-field__label,
      .text-field__label--float {
        top: 1.125em;
        transform: translateY();
        font-size: 0.75em;
        line-height: 1.25em;
        color: rgba(var(--primary));
      }
    `
  }

  render() {
    return html`
      <style>
        :host {
          --primary: ${theme.primary};
          --on-surface: ${theme.onSurface};
        }
      </style>
      <div class=${classMap({ 'text-field': true })}>
        <input
          .value=${this.value}
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
