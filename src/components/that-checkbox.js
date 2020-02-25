import { LitElement, html, css } from 'lit-element'
import { classMap } from 'lit-html/directives/class-map'

class ThatCheckbox extends LitElement {
  constructor() {
    super()
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
        cursor: pointer;
        --primary: 265deg, 100%, 47%;
        --surface: 0deg, 0%, 100%;
        --on-primary: 0deg, 0%, 100%;
        --on-surface: 0deg, 0%, 0%;
      }

      .checkbox {
        user-select: none;
        position: relative;
        width: 1.25em;
        height: 1.25em;
        padding: 0.875em;
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
        width: 2.8125em;
        height: 2.8125em;
        border-radius: 1.4375em;
        background: hsla(var(--primary), 0.188);
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
        background: hsla(var(--on-surface), 0.1);
      }

      .checkbox__box {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 1.25em;
        height: 1.25em;
        box-sizing: border-box;
        border: 0.125em solid hsla(var(--on-surface), 0.54);
        border-radius: 0.125em;
        background: hsla(var(--surface), 0.54);
      }

      .checkbox--checked .checkbox__box {
        border: none;
        background: hsl(var(--primary));
      }

      .checkbox__checkmark {
        display: none;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 0.8125em;
        height: 0.8125em;
      }

      .checkbox--checked .checkbox__checkmark {
        display: initial;
      }

      .checkbox__checkmark-path {
        stroke-width: 3.5;
        stroke: hsl(var(--on-primary));
      }

      .checkbox--ripple.checkbox--checked .checkbox__checkmark-path {
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
    const handleChange = (event) => {
      this.value = !this.value
      event.target.classList.remove('checkbox--ripple')
      void event.target.offsetWidth
      event.target.classList.add('checkbox--ripple')
    }
    return html`
      <div
        tabindex="0"
        class=${classMap({ checkbox: true, 'checkbox--checked': this.value })}
        @click=${handleChange}
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
              handleChange(event)
              return
          }
        }}
      >
        <div class=${classMap({ 'checkbox__focus-ring': true })}></div>
        <div
          class=${classMap({ 'checkbox__active-ring': true })}
          @animationend=${event => {
            event.target.parentElement.classList.remove('checkbox--ripple')
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
}

customElements.define('that-checkbox', ThatCheckbox)
