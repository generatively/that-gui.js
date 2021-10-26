import { LitElement, html, css } from 'lit-element'
import { classMap } from 'lit-html/directives/class-map'

class ThatMenu extends LitElement {
  constructor() {
    super()
    this.options = []
    this.open = false
  }

  static get properties() {
    return {
      label: { type: String },
      value: { type: String },
      options: { type: Array },
      open: { type: Boolean },
      currentIndex_: { type: Number },
    }
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
        font-size: 1em;
        width: 17.5em;
        --primary: 265deg, 100%, 47%;
        --surface: 0deg, 0%, 100%;
        --on-surface: 0deg, 0%, 0%;
      }

      .menu {
        position: relative;
        box-sizing: border-box;
        height: 3.5em;
        border-radius: 0.25em 0.25em 0 0;
        border-bottom: 0.0625em solid hsla(var(--on-surface), 0.6);
        background: hsla(var(--on-surface), 0.039);
        transition: border 0.2s, background-color 0.2s;
        cursor: pointer;
      }

      .menu:hover {
        background: hsla(var(--on-surface), 0.063);
      }

      .menu:focus {
        outline: none;
        background: hsla(var(--on-surface), 0.102);
        border-bottom: 0.125em solid hsla(var(--primary), 0.6);
      }

      .menu__value {
        position: absolute;
        top: 1.25em;
        left: 0.54em;
        width: calc(100% - 1.08em);
        height: calc(100% - 1.25em);
        font-size: inherit;
        line-height: 2.4em;
        color: hsla(var(--on-surface), 0.871);
        border: none;
        background: none;
        text-align: left;
      }

      .menu__label {
        position: absolute;
        user-select: none;
        top: 50%;
        left: 0.75em;
        transform: translateY(-50%);
        color: hsla(var(--on-surface), 0.6);
        transition: top 0.2s, transform 0.2s, font-size 0.2s, color 0.2s;
      }

      .menu:focus .menu__label {
        color: hsla(var(--primary));
      }

      .menu:focus .menu__label,
      .menu__label--float {
        top: 1.125em;
        transform: translateY();
        font-size: 0.75em;
        line-height: 1.25em;
      }

      .menu__arrow {
        position: absolute;
        top: 50%;
        right: 1.25em;
        transform: translateY(-50%);
        width: 0;
        height: 0;
        border-left: 0.3em solid transparent;
        border-right: 0.3em solid transparent;
        border-top: 0.3em solid hsla(var(--on-surface), 0.5);
        transition: transform 0.2s linear, border-top-color 0.2s;
      }

      .menu__arrow--open {
        transform: translateY(-50%) rotate(180deg);
      }

      .menu:focus .menu__arrow {
        border-top-color: hsl(var(--primary));
      }

      .menu__option-container {
        transform: scale(0);
        transform-origin: top;
        position: absolute;
        top: calc(100% + 0.125em);
        width: 100%;
        z-index: 1;
        background: hsl(var(--surface));
        border-radius: 0 0 0.25em 0.25em;
        box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12),
          0 5px 5px -3px rgba(0, 0, 0, 0.2);
        transition: box-shadow 0.2s, transform 0.1s;
      }

      .menu__option-container--open {
        transform: scale(1);
      }

      .menu__option {
        padding: 0 1em;
        line-height: 3em;
        text-align: left;
        user-select: none;
      }

      .menu__option:hover {
        background: hsla(var(--on-surface), 0.06);
      }

      .menu__option:active {
        background: hsla(var(--on-surface), 0.1);
      }

      .menu__option--selected {
        background: hsla(var(--primary), 0.2);
      }
    `
  }

  render() {
    return html`
      <div
        tabindex="0"
        class=${classMap({ menu: true })}
        @click=${() => {
          this.open = !this.open
        }}
        @blur=${() => {
          this.open = false
          this.currentIndex_ = this.options.indexOf(this.value)
        }}
        @keydown=${event => {
          if (!['Escape', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter'].includes(event.key)) return

          event.preventDefault()

          switch (event.key) {
            case 'Escape':
              this.blur()
              return

            case 'End':
              this.currentIndex_ = this.options.length - 1
              return

            case 'Home':
              this.currentIndex_ = 0
              return

            case 'ArrowUp':
              if (this.currentIndex_ > 0) this.currentIndex_--
              return

            case 'ArrowDown':
              if (this.currentIndex_ < this.options.length - 1) this.currentIndex_++
              return

            case 'Enter':
              if (this.open) {
                this.value = this.options[this.currentIndex_]
                this.open = false
              } else {
                this.open = true
              }
              return
          }
        }}
      >
        <div class=${classMap({ menu__value: true })}>${this.value}</div>
        <label class=${classMap({ menu__label: true, 'menu__label--float': this.value })}>
          ${this.label}
        </label>
        <div class=${classMap({ menu__arrow: true, 'menu__arrow--open': this.open })}></div>
        <div class=${classMap({ 'menu__option-container': true, 'menu__option-container--open': this.open })}>
          ${this.options.map((option, index) => {
            return html`
              <div
                class=${classMap({ menu__option: true, 'menu__option--selected': this.currentIndex_ == index })}
                @click=${event => {
                  this.value = this.options[index]
                  this.currentIndex_ = index
                }}
              >
                ${option}
              </div>
            `
          })}
        </div>
      </div>
    `
  }

  firstUpdated(changedProperties) {
    if (changedProperties.has('value')) {
      this.currentIndex_ = this.options.indexOf(this.value)
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('value')) this.dispatchEvent(new Event('change'))
  }
}

customElements.define('that-menu', ThatMenu)
