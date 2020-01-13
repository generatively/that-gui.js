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
    this.minimise = false
    this.actions = []
    this.options = []
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
      minimise: { type: Boolean },
      color: { type: String },
      value: {},
      initialValue: {},
      min: { type: Number },
      max: { type: Number },
      step: { type: Number },
      icon: { type: String },
      options: { type: Array },
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .container {
        font-family: ${unsafeCSS(mainStyle.fontFamily)};
        display: block;
        margin-top: 10px;
        padding: 10px;
        position: relative;
        background: ${unsafeCSS(mainStyle.surface)};
        color: ${unsafeCSS(mainStyle.onSurface)};
        border-radius: 8px;
        transition: box-shadow 0.2s ease-out;
      }

      .container--has-children {
        border: 1px solid ${unsafeCSS(mainStyle.onSurface)}1a;
      }

      .container:not(.container--elevate).container--has-children:hover {
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2);
      }

      .container--elevate {
        box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.20);
      }

      .container--elevate:hover {
        box-shadow: 0 12px 17px 2px rgba(0,0,0,0.14), 0 5px 22px 4px rgba(0,0,0,0.12), 0 7px 8px -4px rgba(0,0,0,0.20);
        z-index: 1;
      }

      .minimise-button {
        cursor: pointer;
        user-select: none;
        margin: 0 10px 0 5px;
      }

      .controller-options {
        float: right;
      }

      .children-container--minimise {
        display: none;
      }
    `
  }

  render() {
    return html`
      <div
        class=${classMap({
          container: true,
          'container--elevate': !this.minimise && this.hasChildNodes(),
          'container--has-children': this.hasChildNodes(),
        })}
      >
        <div title="${this.path}" class=${classMap({ 'form-container': this.type != 'title' })}>
          ${this.hasChildNodes()
            ? html`
                <span
                  class=${classMap({ 'minimise-button': true })}
                  @click=${() => {
                    this.minimise = !this.minimise
                  }}
                >
                  ${this.minimise ? '🡣' : '🡡'}
                </span>
              `
            : ''}
          ${this.appendForm()}
          <div class=${classMap({ 'controller-options': true })}>
            ${this.actions.map(
              action => html`
                <img
                  src="${action[1]}"
                  style=${styleMap({
                    cursor: 'pointer',
                    width: '1em',
                    height: '1em',
                    display: 'inline-block',
                    'vertical-align': 'middle',
                  })}
                  @click=${action[0]}
                />
              `,
            )}
          </div>
        </div>
        <div class=${classMap({ 'children-container': true, 'children-container--minimise': this.minimise })}>
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
            console.log(this.value)
          },
          settings,
        ],
      ]
    }
  }

  appendForm() {
    const type = this.type.split(' ')
    switch (type[0]) {
      case 'number':
        return html`
          ${this.label}
          <that-slider
            label=${this.label}
            min=${this.min || 0}
            max=${this.max || (this.initialValue > 1 ? Math.pow(10, this.initialValue.toString().length) : 1)}
            step=${this.step || (this.initialValue > 1 ? 1 : 0.001)}
            .value=${this.value}
            @change=${event => {
              this.updateValue(Number(event.srcElement.value))
            }}
          ></that-slider>
          ${this.value}
        `

      case 'string':
        return html`
          <that-input
            .value=${this.value}
            .label=${this.label}
            @change=${event => {
              this.updateValue(event.srcElement.value)
            }}
          ></that-input>
        `

      case 'boolean':
        return html`
          ${this.label}:
          <input
            type="checkbox"
            ?checked=${this.value}
            @change=${event => {
              this.updateValue(event.srcElement.checked)
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
      case 'functionArray':
        const buttons = []
        for (const i in this.value) {
          buttons.push(html`
            <that-button
              @click=${this.value[i]}
              .icon=${this.options[i].icon || undefined}
              .type=${this.options[i].type ? this.options[i].type.split(' ') : []}
              style=${styleMap({ flexGrow: 1 })}
            >
              ${this.options[i].label || i}
            </that-button>
          `)
        }
        return html`
          <div
            style=${styleMap({
              textAlign: 'center',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-evenly',
            })}
          >
            ${buttons}
          </div>
        `

      case 'title':
        return this.label

      default:
        return html`
          ${this.label}
          <br /><span style="color: red;">ERROR: Controller type '${type[0]}' is not supported</span>
        `
    }
  }

  updateValue(newValue) {
    this.value = newValue
    if (this.path.split('.').length > 1) {
      this.parentObject[this.key] = newValue
    } else {
      this.parentObject[this.key].__value = newValue
    }
  }
}

customElements.define('that-controller', ThatController)
