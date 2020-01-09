import { LitElement, html, css, unsafeCSS } from 'lit-element'
import { classMap } from 'lit-html/directives/class-map'
import { styleMap } from 'lit-html/directives/style-map'
import { mainStyle } from '../styles'
//replace SVGs with divs + animations
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
      icon: { type: String },
    }
  }

  static get styles() {
    return css`
      :host {
        font-family: Alata;
        display: block;
      }

      .container {
        margin-top: 20px;
        padding: 20px;
        position: relative;
        background: ${unsafeCSS(mainStyle.surface)};
        color: ${unsafeCSS(mainStyle.onSurface)};
        border-radius: 10px;
        transition: box-shadow 0.15s;
      }

      .container:hover {
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2);
      }

      .container--has-children {
        border: 1px solid ${unsafeCSS(mainStyle.onSurface)}1f;
      }

      .container--elevate {
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
      }

      .container--elevate:hover {
        box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14), 0 3px 3px -2px rgba(0, 0, 0, 0.12), 0 1px 8px 0 rgba(0, 0, 0, 0.2);
      }

      .form-component-container {
        margin: 5px 0;
      }

      .controller-options {
        display: none; /* add this back at some point */
        float: right;
      }

      .minimise-button {
        cursor: pointer;
        user-select: none;
        float: left;
        margin-right: 10px;
      }
    `
  }

  render() {
    return html`
      <div
        class=${classMap({
          container: true,
          'container--elevate': !this.minimised && this.hasChildNodes(),
          'container--has-children': this.hasChildNodes(),
        })}
      >
        <div title="${this.path}" class=${classMap({ 'form-component-container': this.type != 'title' })}>
          ${this.hasChildNodes()
            ? html`
                <span
                  class=${classMap({ 'minimise-button': true })}
                  @click=${() => {
                    this.minimised = !this.minimised
                  }}
                >
                  ${this.minimised ? '🡣' : '🡡'}
                </span>
              `
            : ''}
          ${this.appendFormComponent()}
          <div class=${classMap({ 'controller-options': true })}>
            ${this.actions.map(
              action => html`
                <img
                  src="${action[1]}"
                  style=${styleMap({ cursor: 'pointer', width: '1em', height: '1em' })}
                  @click=${action[0]}
                />
              `,
            )}
          </div>
        </div>
        <div style=${styleMap({ display: this.minimised ? 'none' : 'initial' })}>
          <slot></slot>
        </div>
      </div>
    `
  }

  firstUpdated(changedProperties) {
    if (changedProperties.has('value') && typeof this.value != 'function') {
      this.actions = [
        ...this.actions,
        [
          () => {
            this.updateValue(this.initialValue)
          },
          reset,
        ],
        [
          () => {
            this.updateValue(this.randomise())
          },
          randomise,
        ],
        [
          () => {
            console.log(this.value)
          },
          settings,
        ],
      ]
    }
  }

  appendFormComponent() {
    const type = this.type.split(' ')
    switch (type[0]) {
      case 'number':
        return html`
          ${this.label}:
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
          ${this.label}:
          <input
            .value=${this.value}
            @change=${event => {
              console.log(event)
            }}
          />
        `

      case 'boolean':
        return html`
          ${this.label}:
          <input
            type="checkbox"
            ?checked=${this.value}
            @change=${event => {
              console.log(event)
            }}
          />
        `

      case 'function':
        type.shift()
        return html`
          <div style=${styleMap({ textAlign: 'center' })}>
            <that-button @click=${this.value} .icon=${this.icon} .type=${type}>${this.label}</that-button>
          </div>
        `

      case 'object':
        if (Array.isArray(this.value)) {
          return html`
            ${this.label}:
            <input
              .value=${this.value.toString()}
              @change=${event => {
                this.updateValue(event.srcElement.value.split(','))
              }}
            />
          `
        }

      case 'title':
        return this.label

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
