import { LitElement, html, css } from 'lit-element'
import { classMap } from 'lit-html/directives/class-map'
import { styleMap } from 'lit-html/directives/style-map'

class ThatCheckbox extends LitElement {
  constructor() {
    super()
    this.value = ''
  }

  static get properties() {
    return {
      label: { type: String },
      value: { type: Boolean },
    }
  }

  static get styles() {
    return css`
      :host {
        display: inline-flex;
        vertical-align: middle;
        align-items: center;
        --primary: 98, 0, 238;
        --surface: 255, 255, 255;
        --on-primary: 255, 255, 255;
        --on-surface: 0, 0, 0;
      }

      .checkbox {
        user-select: none;
        position: relative;
        width: 1.2em;
        height: 1.2em;
        margin: 0.9em;
      }

      .checkbox:focus {
        outline: none;
      }

      .checkbox * {
        pointer-events: none;
        touch-action: none;
      }

      .checkbox__focus-ring,
      .checkbox__active-ring {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        width: 2.8em;
        height: 2.8em;
        border-radius: 1.4em;
        background: rgba(var(--primary), 0.188);
        opacity: 0;
      }

      .checkbox:hover .checkbox__focus-ring {
        transform: translate(-50%, -50%) scale(0.85);
        opacity: 0.5;
        transition: transform 0.2s ease-out, opacity 0.2s;
      }

      .checkbox:focus .checkbox__focus-ring {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
        transition: transform 0.2s ease-out, background-color 0.2s, opacity 0.2s;
      }

      @keyframes checked {
        0% {
          transform: translate(-50%, -50%) scale(0);
          opacity: 0;
        }
        50% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0;
        }
      }

      .checkbox--ripple .checkbox__active-ring {
        transform: translate(-50%, -50%) scale(0);
        opacity: 0;
        animation: checked 0.4s;
      }

      .checkbox:not(.checkbox--checked):focus .checkbox__focus-ring,
      .checkbox:not(.checkbox--checked):active .checkbox__active-ring {
        background: rgba(var(--on-surface), 0.188);
      }

      .checkbox__box {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 1.2em;
        height: 1.2em;
        box-sizing: border-box;
        border: 0.125em solid rgba(var(--on-surface), 0.54);
        border-radius: 0.125em;
        background: rgba(var(--surface), 0.54);
      }

      .checkbox--checked .checkbox__box {
        border: none;
        background: rgb(var(--primary));
      }

      .checkbox__checkmark {
        display: none;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 0.8em;
        height: 0.8em;
      }

      .checkbox--checked .checkbox__checkmark {
        display: initial;
      }

      .checkbox__checkmark-path {
        stroke-width: 3.5;
        stroke: rgb(var(--on-primary));
      }

      .checkbox--checked:focus .checkbox__checkmark-path {
        stroke-dasharray: 1000;
        stroke-dashoffset: 1000;
        animation: dash 5s linear forwards;
      }

      @keyframes dash {
        to {
          stroke-dashoffset: 0;
        }
      }
    `
  }

  render() {
    return html`
      <div
        tabindex="0"
        class=${classMap({ checkbox: true, 'checkbox--checked': this.value })}
        @click=${event => {
          this.handleChange(event)
        }}
        @keydown=${event => {
          if (![' ', 'Enter'].includes(event.key)) return
          event.preventDefault()
        }}
        @keyup=${event => {
          if (![' ', 'Enter'].includes(event.key)) return
          event.preventDefault()
          switch (event.key) {
            case 'Enter':
            case ' ':
              this.handleChange(event)
              return
          }
        }}
      >
        <div class=${classMap({ 'checkbox__focus-ring': true })}></div>
        <div
          class=${classMap({ 'checkbox__active-ring': true })}
          @animationend=${event => {
            event.srcElement.parentElement.classList.remove('checkbox--ripple')
          }}
        ></div>
        <div class=${classMap({ checkbox__box: true })}></div>
        <svg class="checkbox__checkmark" viewBox="0 0 24 24">
          <path class="checkbox__checkmark-path" fill="none" stroke="white" d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
        </svg>
      </div>
      <div class=${classMap({ label: true })}>${this.label}</div>
    `
  }

  updated(changedProperties) {
    if (changedProperties.has('value')) this.dispatchEvent(new Event('change'))
  }

  handleChange(event) {
    this.value = !this.value
    event.srcElement.classList.remove('checkbox--ripple')
    void event.srcElement.offsetWidth
    event.srcElement.classList.add('checkbox--ripple')
  }
}

customElements.define('that-checkbox', ThatCheckbox)
