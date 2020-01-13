import { LitElement, html, css, unsafeCSS } from 'lit-element'
import { classMap } from 'lit-html/directives/class-map'
import { mainStyle } from '../styles'

class ThatButton extends LitElement {
  constructor() {
    super()
  }

  static get properties() {
    return {
      icon: { type: String },
      type: { type: Array },
      fill: { type: Boolean },
      outline: { type: Boolean },
      elevate: { type: Boolean },
      shaped: { type: Boolean },
      disabled: { type: Boolean },
    }
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
        margin: 4px;
        cursor: pointer;
        user-select: none;
        min-width: 64px;
        height: 36px;
      }

      .button {
        height: 100%;
        background: ${unsafeCSS(mainStyle.surface)};
        color: ${unsafeCSS(mainStyle.primary)};
        border-radius: 4px;
        padding: 0 16px;
        transition: box-shadow 0.1s;
      }

      .button:hover {
        background: ${unsafeCSS(mainStyle.primary)}1f;
      }

      .button:active {
        background: ${unsafeCSS(mainStyle.primary)}3e;
      }

      .button--shaped {
        border-radius: 18px;
      }

      .button--outline {
        color: ${unsafeCSS(mainStyle.onSurface)};
        border: ${unsafeCSS(mainStyle.primary)} 1pt solid;
      }

      .button--fill {
        background: ${unsafeCSS(mainStyle.primary)};
        color: ${unsafeCSS(mainStyle.onPrimary)};
      }

      .button--fill:hover {
        background: ${unsafeCSS(mainStyle.primary)}e0;
      }

      .button--fill:active {
        background: ${unsafeCSS(mainStyle.primaryVariant)};
      }

      .button--elevate {
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
        /* box-shadow: 0 2px 2px 0 ${unsafeCSS(mainStyle.primary)}24, 0 3px 1px -2px ${unsafeCSS(mainStyle.primary)}1f,
          0 1px 5px 0 ${unsafeCSS(mainStyle.primary)}33; */
      }

      .button--elevate:active {
        box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12),
          0 5px 5px -3px rgba(0, 0, 0, 0.2);
        /* box-shadow: 0 8px 10px 1px ${unsafeCSS(mainStyle.primary)}24, 0 3px 14px 2px ${unsafeCSS(
      mainStyle.primary,
    )}1f,
          0 5px 5px -3px ${unsafeCSS(mainStyle.primary)}33; */
      }

      .button--has-icon {
        padding: 0 16px 0 14px;
      }

      .text {
        text-align: center;
        font-family: ${unsafeCSS(mainStyle.fontFamily)};
        font-size: 16px;
        line-height: 36px;
      }

      .icon {
        padding: 9px 4px 9px 0;
        vertical-align: bottom;
        height: 18px;
        width: 18px;
      }
    `
  }

  render() {
    return html`
      <div
        class=${classMap({
          button: true,
          'button--fill': this.fill,
          'button--outline': this.outline,
          'button--elevate': this.elevate,
          'button--shaped': this.shaped,
          'button--has-icon': this.icon != undefined,
        })}
      >
        ${this.icon
          ? html`
              <img src=${this.icon} class=${classMap({ icon: true })} />
            `
          : ``}
        <span class=${classMap({ text: true })}><slot></slot></span>
      </div>
    `
  }

  firstUpdated(changedParameters) {
    if (changedParameters.has('type') && this.type.length > 0) {
      if (this.type[0] != 'text') {
        this.type.forEach(param => {
          param.charAt(0) == '!' ? (this[param.slice(1)] = false) : (this[param] = true)
        })
      }
    } else {
      this.fill = true
      this.elevate = true
    }
  }
}

customElements.define('that-button', ThatButton)
