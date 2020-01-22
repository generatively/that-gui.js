import { LitElement, html, css } from 'lit-element'
import { classMap } from 'lit-html/directives/class-map'
import { styleMap } from 'lit-html/directives/style-map'
//replace SVGs with divs + animations
import reset from '../images/reset.svg'
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
      object: { type: Object },
      gui: { type: Object },
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
        font-size: 1rem;
        margin-top: 0.5em;
        transition: font-size 0.2s;
      }

      ::slotted(that-controller:first-child) {
        margin-top: 0;
      }

      that-input {
        display: block;
        width: auto;
      }

      .controller {
        display: block;
        position: relative;
        box-sizing: border-box;
        left: 0;
        width: 100%;
        color: rgb(var(--on-surface));
        border-radius: 0.5em;
        transition: box-shadow 0.2s ease-out, width 0.2s, left 0.2s;
      }

      .controller--has-children {
        border: 1px solid rgba(var(--on-surface), 0.12);
        background: rgb(var(--surface));
      }

      .controller:not(.controller--elevate).controller--has-children:hover {
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2);
      }

      .controller--elevate {
        border: none;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
      }

      .controller--active {
        box-shadow: 0 12px 17px 2px rgba(0, 0, 0, 0.14), 0 5px 22px 4px rgba(0, 0, 0, 0.12),
          0 7px 8px -4px rgba(0, 0, 0, 0.2);
        z-index: 1;
      }

      .controller--has-children .controller__form-container {
        padding: 1em;
      }

      .controller__form-container {
        display: flex;
        align-items: center;
      }

      .controller--has-children .controller__form-container--is-title {
        display: block;
        cursor: pointer;
        user-select: none;
      }

      .controller__minimise-arrow-container {
        cursor: pointer;
        display: inline-block;
        position: relative;
        width: 2em;
        height: 2em;
        vertical-align: middle;
      }

      .controller__minimise-arrow {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 0;
        height: 0;
        border-left: 0.4em solid transparent;
        border-right: 0.4em solid transparent;
        border-top: 0.4em solid rgba(var(--on-surface), 0.5);
        transition: transform 0.2s linear, border-top-color 0.2s;
      }

      .controller__minimise-arrow--open {
        transform: translate(-50%, -50%) rotate(-180deg);
      }

      .controller__form-component-container {
        flex-grow: 1;
        display: inline-block;
        text-align: center;
      }

      .controller__form-component-container--childless-title {
        width: 100%;
        padding: 1em 0;
        color: rgb(var(--primary));
      }

      .controller__actions {
        display: inline-flex;
        flex-wrap: nowrap;
        vertical-align: middle;
        user-select: none;
      }

      .controller__action-item {
        cursor: pointer;
        width: 1em;
        height: 1em;
        margin: 0.125em;
        display: inline-block;
        vertical-align: middle;
      }

      .controller--has-children .controller__children {
        padding: 1em;
        padding-top: 0;
      }

      .controller__children--minimise {
        display: none;
      }

      @media (max-width: 1000px), (hover: none) {
        .controller--active {
          transition-delay: 0.2s;
        }

        :host {
          font-size: 2rem;
        }
      }
    `
  }

  render() {
    return html`
      <style>
        :host,
        that-button,
        that-input,
        that-menu,
        that-slider,
        that-checkbox {
          --primary: ${this.gui.theme.primary};
          --primary-variant: ${this.gui.theme.primaryVariant};
          --secondary: ${this.gui.theme.secondary};
          --secondary-variant: ${this.gui.theme.secondaryVariant};
          --background: ${this.gui.theme.background};
          --surface: ${this.gui.theme.surface};
          --error: ${this.gui.theme.error};
          --on-primary: ${this.gui.theme.onPrimary};
          --on-secondary: ${this.gui.theme.onSecondary};
          --on-background: ${this.gui.theme.onBackground};
          --on-surface: ${this.gui.theme.onSurface};
          --on-error: ${this.gui.theme.onError};
        }
      </style>
      <div
        id="controller"
        class=${classMap({
          controller: true,
          'controller--elevate': !this.minimise && this.hasChildNodes(),
          'controller--has-children': this.hasChildNodes(),
        })}
      >
        <div
          title="${this.path}"
          class=${classMap({
            'controller__form-container': true,
            'controller__form-container--is-title': this.type == 'title',
          })}
          @click=${this.type == 'title'
            ? () => {
                this.setMinimised(!this.minimise)
              }
            : undefined}
        >
          ${this.hasChildNodes()
            ? html`
                <div
                  class=${classMap({ 'controller__minimise-arrow-container': true })}
                  @click=${this.type != 'title'
                    ? () => {
                        this.setMinimised(!this.minimise)
                      }
                    : undefined}
                >
                  <div
                    class=${classMap({
                      'controller__minimise-arrow': true,
                      'controller__minimise-arrow--open': !this.minimise,
                    })}
                  ></div>
                </div>
              `
            : ''}
          <div
            class=${classMap({
              'controller__form-component-container': true,
              'controller__form-component-container--childless-title': !this.hasChildNodes() && this.type == 'title',
            })}
          >
            ${this.appendForm()}
          </div>
          ${this.type != 'title'
            ? html`
                <div class=${classMap({ controller__actions: true })}>
                  ${this.actions.map(
                    action => html`
                      <img
                        src=${action[1]}
                        class=${classMap({ 'controller__action-item': true })}
                        @click=${() => {
                          action[0](this)
                        }}
                      />
                    `,
                  )}
                </div>
              `
            : ''}
        </div>
        <div
          id="children"
          class=${classMap({ controller__children: true, 'controller__children--minimise': this.minimise })}
        >
          <slot></slot>
        </div>
      </div>
    `
  }

  firstUpdated(changedProperties) {
    if (changedProperties.has('gui')) this.setupEventListeners()

    if (changedProperties.has('value') && !this.type.includes('function')) {
      this.actions = [
        ...this.actions,
        [
          controller => {
            controller.updateValue(controller.initialValue)
          },
          reset,
        ],
        [
          controller => {
            console.log(controller.value)
          },
          settings,
        ],
      ]
    }
  }

  setupEventListeners() {
    const containerElem = this.shadowRoot.getElementById('controller')
    const activeLeftPosition = -0.5 * (this.gui.container.shadowRoot.firstElementChild.clientWidth - this.clientWidth)

    const setActive = active => {
      if (active && this.hasChildNodes() && !this.minimise) {
        containerElem.classList.add('controller--active')
        containerElem.style.width = `${this.gui.container.shadowRoot.firstElementChild.clientWidth}px`
        containerElem.style.left = `${activeLeftPosition}px`
      } else {
        containerElem.classList.remove('controller--active')
        containerElem.style.width = ''
        containerElem.style.left = ''
      }
    }

    const handleOver = event => {
      if (
        event.target == this ||
        ((!event.target.hasChildNodes() || event.target.minimise) && event.target.parentElement == this)
      ) {
        setActive(true)
        this.addEventListener('mouseout', handleOut)
      }
    }

    const handleOut = event => {
      if (
        event.target == this ||
        ((!event.target.hasChildNodes() || event.target.minimise) && event.target.parentElement == this)
      ) {
        setActive(false)
        this.removeEventListener('mouseout', handleOut)
      }
    }

    const handleTouchStart = event => {
      if (
        event.target == this ||
        ((!event.target.hasChildNodes() || event.target.minimise) && event.target.parentElement == this)
      ) {
        setActive(true)
        this.addEventListener('touchend', handleTouchEnd)
      }
    }

    const handleTouchEnd = end => {
      if (
        event.target == this ||
        ((!event.target.hasChildNodes() || event.target.minimise) && event.target.parentElement == this)
      ) {
        setActive(false)
        this.removeEventListener('touchend', handleTouchEnd)
      }
    }

    this.addEventListener('mouseover', handleOver)
    this.addEventListener('touchstart', handleTouchStart)
    this.addEventListener('minimisetoggled', event => {
      setActive(!this.minimise)
      this.minimise
        ? this.parentElement.dispatchEvent(new Event('mouseover'))
        : this.parentElement.dispatchEvent(new Event('mouseout'))
    })
  }

  appendForm() {
    const type = this.type.split(' ')
    switch (type[0]) {
      case 'number':
        return html`
          <that-slider
            .min=${this.min || 0}
            .max=${this.max || (this.initialValue > 1 ? Math.pow(10, this.initialValue.toString().length) : 1)}
            .step=${this.step || (this.initialValue > 1 ? 1 : 0.001)}
            .maxValue=${this.value}
            .label=${this.label}
            @change=${event => {
              this.updateValue(Number(event.srcElement.maxValue))
            }}
            style=${styleMap({ width: 'initial' })}
          ></that-slider>
        `

      case 'range':
        return html`
          <that-slider
            .min=${this.min || 0}
            .max=${this.max || (this.initialValue > 1 ? Math.pow(10, this.initialValue.toString().length) : 1)}
            .step=${this.step || (this.initialValue > 1 ? 1 : 0.001)}
            .minValue=${this.value[0]}
            .maxValue=${this.value[1]}
            .label=${this.label}
            @change=${event => {
              this.updateValue([Number(event.srcElement.minValue), Number(event.srcElement.maxValue)])
            }}
            style=${styleMap({ width: 'initial' })}
          ></that-slider>
        `

      case 'input':
      case 'string':
        return html`
          <that-input
            .value=${this.value}
            .label=${this.label}
            @change=${typeof this.value == 'number'
              ? event => {
                  const newValue = Number(event.srcElement.value)
                  if (!isNaN(newValue)) this.updateValue(newValue)
                }
              : event => {
                  this.updateValue(event.srcElement.value)
                }}
          ></that-input>
        `
      case 'menu':
        return html`
          <that-menu
            .value=${this.value}
            .label=${this.label}
            .options=${this.options}
            @change=${event => {
              this.updateValue(event.srcElement.value)
            }}
            style=${styleMap({ width: 'calc(100% - 0.6em)' })}
          ></that-menu>
        `

      case 'boolean':
        return html`
          <that-checkbox
            .value=${this.value}
            .label=${this.label}
            @change=${event => {
              this.updateValue(event.srcElement.value)
            }}
            style=${styleMap({ float: 'left' })}
          ></that-checkbox>
        `

      case 'function':
        type.shift()
        return html`
          <that-button @click=${this.value} .icon=${this.icon} .type=${type}>${this.label}</that-button>
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
              display: 'flex',
              flexWrap: 'wrap',
            })}
          >
            ${buttons}
          </div>
        `

      case 'title':
        return this.value != undefined && typeof this.value != 'object' ? this.value : this.label

      default:
        return html`
          ${this.label}
          <br /><span style="color: red;">ERROR: Controller type '${type[0]}' is not supported</span>
        `
    }
  }

  setMinimised(minimise) {
    this.minimise = minimise
    this.dispatchEvent(
      new CustomEvent('minimisetoggled', {
        detail: {
          minimised: this.minimise,
        },
      }),
    )
  }

  updateValue(newValue) {
    this.value = newValue
    if (this.path.split('.').length > 1) {
      this.object[this.key] = newValue
    } else {
      this.object[this.key].__value = newValue
    }
  }
}

customElements.define('that-controller', ThatController)
