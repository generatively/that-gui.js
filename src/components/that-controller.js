import { LitElement, html, css } from 'lit-element'
import { classMap } from 'lit-html/directives/class-map'
import { styleMap } from 'lit-html/directives/style-map'

class ThatController extends LitElement {
  constructor() {
    super()
    this.tags = []
    this.actions = {}
    this.minimise = false
  }

  static get properties() {
    return {
      path: { type: String },
      key: { type: String },
      object: { type: Object },
      gui: { type: Object },
      type: { type: String },
      tags: { type: Array },
      actions: { type: Object },
      hideActions: { type: Boolean },
      minimise: { type: Boolean },
      component: { type: Object },
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
        font-size: 1rem;
        margin-bottom: 0.5em;
        transition: font-size 0.2s;
      }

      that-input {
        display: block;
        width: auto;
      }

      that-color-picker {
        width: 100%;
      }

      .controller {
        display: block;
        position: relative;
        box-sizing: border-box;
        left: 0;
        width: 100%;
        color: hsl(var(--on-surface));
        border-radius: 0.5em;
        transition: box-shadow 0.2s ease-out, width 0.1s, left 0.1s;
      }

      .controller--has-children {
        box-shadow: 0 0 0 1px hsla(var(--on-surface), 0.1);
        background: hsl(var(--surface));
      }

      .controller:not(.controller--open).controller--has-children:hover {
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2);
      }

      .controller--open {
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2);
      }

      .controller--active {
        box-shadow: 0 12px 17px 2px rgba(0, 0, 0, 0.14), 0 5px 22px 4px rgba(0, 0, 0, 0.12),
          0 7px 8px -4px rgba(0, 0, 0, 0.2);
        z-index: 1;
      }

      .controller__form-container {
        display: flex;
        align-items: center;
      }

      .controller--has-children .controller__form-container--is-title {
        cursor: pointer;
        user-select: none;
      }

      .controller__minimise-arrow-container {
        cursor: pointer;
        display: inline-block;
        position: relative;
        width: 3em;
        height: 3em;
        vertical-align: middle;
      }

      .controller__minimise-arrow-container::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        width: 2.5em;
        height: 2.5em;
        border-radius: 50%;
        opacity: 0;
        background: hsla(var(--on-surface), 0.1);
        transition: opacity 0.2s, transform 0.2s;
      }

      .controller__minimise-arrow-container:focus {
        outline: none;
      }

      .controller__minimise-arrow-container:focus::after {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
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
        border-top: 0.4em solid hsla(var(--on-surface), 0.5);
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

      .controller--has-children .controller__form-component-container {
        text-align: left;
        padding: 1em 0;
      }

      .controller__form-component-container--childless-title {
        width: 100%;
        color: hsl(var(--primary));
        padding: 1em 0;
      }

      .controller__actions-container {
        position: relative;
        padding: 0 0.3125em;
        vertical-align: middle;
        user-select: none;
        cursor: pointer;
      }

      .controller__actions-container:focus {
        outline: none;
      }

      .controller--has-children .controller__actions-container {
        margin-right: 1em;
      }

      .controller__actions-button {
        display: flex;
        height: calc(0.75em + 6px);
        flex-direction: column;
        justify-content: space-between;
        touch-action: none;
        pointer-events: none;
      }

      .controller__actions-button-dot {
        width: 0.25em;
        height: 0.25em;
        border-radius: 50%;
        background: hsla(var(--on-surface), 0.5);
      }

      .controller__actions-menu {
        display: none;
        overflow: hidden;
        position: absolute;
        top: calc(100% + 0.25em);
        right: -0.125em;
        padding: 0.5em 0;
        border-radius: 0.25em;
        background: hsl(var(--surface));
        box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
        z-index: 1;
      }

      .controller__actions-container:focus .controller__actions-menu {
        display: initial;
      }

      .controller__action {
        display: inline-block;
        box-sizing: border-box;
        padding: 0 1em;
        min-width: 7em;
        line-height: 3em;
        cursor: pointer;
      }

      .controller__action:hover {
        background: hsl(var(--primary), 0.08);
      }

      .controller__action:active {
        background: hsl(var(--primary), 0.16);
      }

      .controller--has-children .controller__children {
        padding: 1em;
        padding-bottom: 0.5em;
        padding-top: 0;
      }

      .controller__children--minimise {
        display: none;
      }

      @media (hover: none) {
        .controller--active {
          transition-delay: 0.1s;
        }

        @media (max-width: 1000px) {
          :host {
            font-size: 1.5rem;
          }
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
        that-tabbar,
        that-slider,
        that-checkbox,
        that-color-picker {
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
          'controller--open': !this.minimise && this.hasChildNodes(),
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
                  tabindex="0"
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
            : undefined}
          <div
            class=${classMap({
              'controller__form-component-container': true,
              'controller__form-component-container--childless-title': !this.hasChildNodes() && this.type == 'title',
            })}
            style=${this.switch && this.type == 'tabs'
              ? styleMap({
                  padding: '0',
                  overflow: 'hidden',
                  borderRadius: '0 0.5em 0 0',
                })
              : undefined}
          >
            ${this.component}
          </div>
          ${this.hideActions || Object.keys(this.actions).length == 0
            ? undefined
            : html`
                <div tabindex="0" class=${classMap({ 'controller__actions-container': true })}>
                  <div class=${classMap({ 'controller__actions-button': true })}>
                    <div class=${classMap({ 'controller__actions-button-dot': true })}></div>
                    <div class=${classMap({ 'controller__actions-button-dot': true })}></div>
                    <div class=${classMap({ 'controller__actions-button-dot': true })}></div>
                  </div>
                  <div class=${classMap({ 'controller__actions-menu': true })}>
                    ${Object.keys(this.actions).map(
                      key =>
                        html`
                          <div
                            class=${classMap({ controller__action: true })}
                            @click=${() => {
                              this.actions[key](this)
                            }}
                          >
                            ${key}
                          </div>
                        `,
                    )}
                  </div>
                </div>
              `}
        </div>
        <div
          id="children"
          class=${classMap({ controller__children: true, 'controller__children--minimise': this.minimise })}
        >
          <slot name=${this.switch ? this.component.value : ''}></slot>
        </div>
      </div>
    `
  }

  firstUpdated(changedProperties) {
    if (this.switch) {
      if (!changedProperties.has('hideActions')) this.hideActions = true
      if (changedProperties.has('component')) this.component.addEventListener('change', event => this.requestUpdate())
    }

    this.updateComplete.then(() => {
      if (changedProperties.has('gui')) this.setupEventListeners()
    })
  }

  setActive(active) {
    const containerElem = this.shadowRoot.getElementById('controller')
    const activeLeftPosition = 1 - this.path.split('.').length
    if (active && this.hasChildNodes() && !this.minimise) {
      containerElem.classList.add('controller--active')
      containerElem.style.width = `${this.gui.container.shadowRoot.getElementById('container').clientWidth - 40}px`
      containerElem.style.left = `${activeLeftPosition}em`
    } else {
      containerElem.classList.remove('controller--active')
      containerElem.style.width = ''
      containerElem.style.left = ''
    }
  }

  setupEventListeners() {
    const handleOver = event => {
      if (
        event.target == this ||
        ((!event.target.hasChildNodes() || event.target.minimise) && event.target.parentElement == this)
      ) {
        this.setActive(true)
        this.addEventListener('mouseout', handleOut)
      }
    }

    const handleOut = event => {
      if (
        event.target == this ||
        ((!event.target.hasChildNodes() || event.target.minimise) && event.target.parentElement == this)
      ) {
        this.setActive(false)
        this.removeEventListener('mouseout', handleOut)
      }
    }

    this.addEventListener('mouseover', handleOver)
    this.addEventListener('focus', event =>
      this.hasChildNodes()
        ? this.setActive(true)
        : this.parentElement != this.gui.container
        ? this.parentElement.setActive(true)
        : undefined,
    )
    this.addEventListener('blur', event =>
      this.hasChildNodes()
        ? this.setActive(false)
        : this.parentElement != this.gui.container
        ? this.parentElement.setActive(false)
        : undefined,
    )
    this.addEventListener('minimisetoggled', event => {
      this.setActive(!this.minimise)
      if (this.parentElement.tagName == 'THAT-CONTROLLER') this.parentElement.setActive(this.minimise)
    })
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
}

customElements.define('that-controller', ThatController)
