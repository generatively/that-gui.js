import { LitElement, html, css } from 'lit-element'
import { classMap } from 'lit-html/directives/class-map'

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
        font-size: 1em;
        margin: 0.25em;
        cursor: pointer;
        user-select: none;
        min-width: 4em;
        height: 2.25em;
        --primary: 265deg, 100%, 47%;
        --primary-variant: 258deg, 100%, 35%;
        --surface: 0deg, 0%, 100%;
        --error: 349deg, 100%, 35%;
        --on-primary: 0deg, 0%, 100%;
        --on-surface: 0deg, 0%, 0%;
        --on-error: 0deg, 0%, 100%;
      }

      .button {
        height: 100%;
        background: hsl(var(--surface));
        color: hsl(var(--primary));
        border-radius: 0.25em;
        padding: 0 1em;
        text-align: center;
        transition: box-shadow 0.1s;
      }

      .button:focus {
        outline: none;
      }

      .button:hover,
      .button:focus {
        background: hsla(var(--primary), 0.122);
      }

      .button:active {
        background: hsla(var(--primary), 0.243);
      }

      .button--shaped {
        border-radius: 1.125em;
      }

      .button--outline {
        color: hsl(var(--on-surface));
        border: hsl(var(--primary)) 1pt solid;
      }

      .button--fill {
        background: hsl(var(--primary));
        color: hsl(var(--on-primary));
      }

      .button--fill:hover,
      .button--fill:focus {
        background: hsla(var(--primary), 0.878);
      }

      .button--fill:active {
        background: hsl(var(--primary-variant));
      }

      .button--elevate {
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
      }

      .button--elevate:active {
        box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12),
          0 5px 5px -3px rgba(0, 0, 0, 0.2);
      }

      .button--has-icon {
        padding: 0 1em 0 0.875em;
      }

      .text {
        line-height: 2.25em;
      }

      .icon {
        display: inline-block;
        padding: 0.5625em 0.25em 0.5625em 0;
        vertical-align: bottom;
        height: 1.125em;
        width: 1.125em;
      }
    `
  }

  render() {
    return html`
      <div
        tabindex="0"
        class=${classMap({
          button: true,
          'button--fill': this.fill,
          'button--outline': this.outline,
          'button--elevate': this.elevate,
          'button--shaped': this.shaped,
          'button--has-icon': this.icon != undefined,
        })}
        @keydown=${event => {
          if (![' ', 'Enter'].includes(event.key)) return
          event.preventDefault()
        }}
        @keyup=${event => {
          if (![' ', 'Enter'].includes(event.key)) return
          event.preventDefault()
          this.dispatchEvent(new Event('click'))
        }}
      >
        ${this.icon
          ? html`
              <div class=${classMap({ icon: true })}>
                ${typeof this.icon == 'object'
                  ? this.icon
                  : html`
                      <img src=${this.icon} />
                    `}
              </div>
            `
          : undefined}
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
