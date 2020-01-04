import { LitElement, html, css } from 'lit-element'
import { classMap } from 'lit-html/directives/class-map'
import { styleMap } from 'lit-html/directives/style-map'

class ThatController extends LitElement {
  constructor() {
    super()
    this.minimised = false
  }

  static get properties() {
    return {
      path: { type: String },
      key: { type: String },
      label: { type: String },
      parentObject: { type: Object },
      randomise: { type: Object },
      type: { type: String },
      tags: { type: Array },
      minimised: { type: Boolean },
      color: { type: String },
      value: {},
      initialValue: {},
      min: { type: Number },
      max: { type: Number },
      step: { type: Number },
    }
  }

  static get styles() {
    return css`
      :host {
        font-family: Alata;
        display: block;
      }

      .container {
        margin: 10pt;
        margin-bottom: 0;
        padding-bottom: 5pt;
        border: 1px solid #ddd;
        border-radius: 5pt;
      }

      .form-component-container {
        padding: 15pt;
      }

      .controller-options {
        float: right;
      }
    `
  }

  render() {
    return html`
      <div class=${classMap({ container: true })} style=${styleMap({ backgroundColor: this.color })}>
        <div title="${this.path}" class=${classMap({ 'form-component-container': true })}>
          <button
            @click=${() => {
              this.minimised = !this.minimised
            }}
          >
            ${this.minimised ? '➡️' : '⬇️'}
          </button>
          ${this.label}: ${this.appendFormComponent()}
          <div class=${classMap({ 'controller-options': true })}>
            <button>settings</button>
            ${this.value != undefined
              ? html`
                  <button
                    @click=${() => {
                      this.updateValue(this.initialValue)
                    }}
                  >
                    reset
                  </button>
                  <button>randomise</button>
                `
              : ``}
          </div>
        </div>
        <div style=${styleMap({ display: this.minimised ? 'none' : 'initial' })}>
          <slot></slot>
        </div>
      </div>
    `
  }

  appendFormComponent() {
    if (this.value != undefined) {
      const type = typeof this.value
      switch (type) {
        case 'number':
          return html`
            <input
              type="range"
              min=${this.min || 0}
              max=${this.max || this.initialValue > 1 ? Math.pow(10, this.initialValue.toString().length) : 1}
              step=${this.step || this.initialValue > 1 ? 1 : 0.001}
              .value=${this.value}
              @change=${event => {
                this.updateValue(Number(event.srcElement.value))
              }}
            />
            ${this.value}
          `

        case 'string':
          return html`
            <input
              .value=${this.value}
              @change=${event => {
                console.log(event)
              }}
            />
          `

        case 'boolean':
          return html`
            <input
              type="checkbox"
              ?checked=${this.value}
              @change=${event => {
                console.log(event)
              }}
            />
          `

        case 'function' || 'button':
          return html`
            <input type="button" value=${this.label} @click="${this.value}" />
          `

        case 'object':
          if (Array.isArray(this.value)) {
            return html`
              <input
                .value=${this.value.toString()}
                @change=${event => {
                  console.log(event)
                }}
              />
            `
          }

        default:
          return html`
            <span style="color: red;">ERROR: Controller type not supported</span>
          `
      }
    }
  }

  updateValue(newValue) {
    this.value = newValue
    if (this.path.split('.').length > 1) {
      this.parentObject[this.key] = newValue
    } else {
      this.parentObject[this.key]._value = newValue
    }
  }
}

customElements.define('that-controller', ThatController)
