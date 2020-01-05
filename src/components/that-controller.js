import { LitElement, html, css } from 'lit-element'
import { classMap } from 'lit-html/directives/class-map'
import { styleMap } from 'lit-html/directives/style-map'
import reset from '../images/reset.svg'
import randomise from '../images/randomise.svg'
import settings from '../images/settings.svg'

class ThatController extends LitElement {
  constructor() {
    super()
    this.minimised = false
    this.actions = []
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
      actions: { type: Array },
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
          ${this.hasChildNodes()
            ? html`
                <span
                  style=${styleMap({ cursor: 'pointer', color: 'blue' })}
                  @click=${() => {
                    this.minimised = !this.minimised
                  }}
                >
                  ${this.minimised ? '🡣' : '🡡'}
                </span>
              `
            : ``}
          ${this.label}: ${this.appendFormComponent()}
          <div class=${classMap({ 'controller-options': true })}>
            ${this.actions.map(action => html`
                  <img
                    src="${action[1]}"
                    style=${styleMap({ cursor: 'pointer', width: '1em', height: '1em' })}
                    @click=${action[0]}
                  />
                `)
            }
          </div>
        </div>
        <div style=${styleMap({ display: this.minimised ? 'none' : 'initial' })}>
          <slot></slot>
        </div>
      </div>
    `
  }

  firstUpdated(changedProperties) {
    if (changedProperties.has('value')) {
      this.actions = [
        ...this.actions, 
        [() => {this.updateValue(this.initialValue)}, reset], //move reset and randomise to that-gui.js
        [() => {this.updateValue(this.randomise())}, randomise],
        [() => {console.log(this.value)}, settings],
      ]
    }
  }

  appendFormComponent() {
    switch (this.type) {
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
          <that-button @click="${this.value}">${this.label}</that-button>
        `

      case 'object':
        if (Array.isArray(this.value)) {
          return html`
            <input
              .value=${this.value.toString()}
              @change=${event => {
                this.updateValue(event.srcElement.value.split(','))
              }}
            />
          `
        }

      case 'title':
        return

      default:
        return html`
          <span style="color: red;">ERROR: Controller type not supported</span>
        `
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
