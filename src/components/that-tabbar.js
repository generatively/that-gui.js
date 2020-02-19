import { LitElement, html, css } from 'lit-element'
import { classMap } from 'lit-html/directives/class-map'
import { styleMap } from 'lit-html/directives/style-map'

class ThatTabBar extends LitElement {
  constructor() {
    super()
    this.options = []
    this.currentIndex_ = -1
  }

  static get properties() {
    return {
      value: { type: String },
      options: { type: Array },
      currentIndex_: { type: Number },
    }
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
        width: 100%;
        font-size: 1em;
        cursor: pointer;
        --primary: 265deg, 100%, 47%;
        --surface: 0deg, 0%, 100%;
        --on-surface: 0deg, 0%, 0%;
      }

      .tabbar {
        display: inline-flex;
        width: 100%;
        box-sizing: border-box;
      }

      .tabbar__option {
        display: inline-block;
        flex-grow: 1;
        box-sizing: border-box;
        line-height: 3em;
        text-align: center;
        user-select: none;
        color: hsla(var(--on-surface), 0.7);
        transition: background-color 0.2s;
      }

      .tabbar__option:hover:not(.tabbar__option--selected) {
        background: hsla(var(--on-surface), 0.06);
      }

      .tabbar__option:active:not(.tabbar__option--selected) {
        background: hsla(var(--primary), 0.2);
      }

      .tabbar__option:focus {
        outline: none;
      }

      .tabbar__option--selected {
        background: hsla(var(--primary), 0.1);
      }

      .tabbar__option--active {
        color: hsla(var(--primary));
        border-bottom: 0.125em solid hsla(var(--primary), 0.6);
      }
    `
  }

  render() {
    return html`
      <div class=${classMap({ tabbar: true })}>
        ${this.options.map((option, index) => {
          return html`
            <div
              tabindex=${this.value == option ? 0 : -1}
              class=${classMap({
                tabbar__option: true,
                'tabbar__option--selected': this.currentIndex_ == index,
                'tabbar__option--active': this.value == option,
              })}
              style=${styleMap({ width: 100 / this.options.length + '%' })}
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
    `
  }

  firstUpdated(changedProperties) {
    this.addEventListener('blur', event => {
      this.currentIndex_ = -1
    })

    this.addEventListener('keydown', event => {
      if (!['Escape', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter'].includes(event.key)) return

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

        case 'ArrowLeft':
          if (this.currentIndex_ > 0) this.currentIndex_--
          return

        case 'ArrowRight':
          if (this.currentIndex_ < this.options.length - 1) this.currentIndex_++
          return

        case 'Enter':
          this.value = this.options[this.currentIndex_]
          return
      }
    })
  }

  updated(changedProperties) {
    if (changedProperties.has('value')) this.dispatchEvent(new Event('change'))
  }
}

customElements.define('that-tabbar', ThatTabBar)
