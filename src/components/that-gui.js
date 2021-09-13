import { LitElement, html, css } from 'lit-element'
import { classMap } from 'lit-html/directives/class-map'
import { styleMap } from 'lit-html/directives/style-map'

class ThatGuiComponent extends LitElement {
  constructor() {
    super()
    this.hasParent = false
    this.minimised = false
    this.width = 500
  }

  static get properties() {
    return {
      hasParent: { type: Boolean },
      minimised: { type: Boolean },
      width: { type: Number },
    }
  }

  static get styles() {
    return css`
      :host {
        font-family: Helvetica, Arial, sans-serif;
      }

      .container {
        position: fixed;
        overflow-y: auto;
        top: 0;
        right: 0;
        display: block;
        box-sizing: border-box;
        width: 500px;
        height: 100vh;
        box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
        padding: 20px;
        background: white;
        transition: right 0.5s;
      }

      .container--has-parent {
        position: unset;
        top: unset;
        right: unset;
        width: 100%;
        height: 100%;
        box-shadow: none;
      }

      .container::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }

      .container::-webkit-scrollbar-track {
        background: #efefef;
      }

      .container::-webkit-scrollbar-thumb {
        background: #aaa;
      }

      .minimise-button {
        position: fixed;
        top: 50%;
        right: 0;
        width: 1.5em;
        height: 3em;
        border-radius: 1.5em 0 0 1.5em;
        transform: translateY( -50%);
        transform-origin: center right;
        background: white;
        box-shadow: -2.5px 0 4px -2px hsla(0deg, 0%, 0%, 0.4);
        cursor: pointer;
        transition: width 0.2s, right 0.5s;
      }

      .minimise-button:focus,
      .minimise-button:hover {
        width: 2em;
      }
    `
  }

  render() {
    return html`
      <div
        id="container"
        class=${classMap({ container: true, 'container--has-parent': this.hasParent })}
        style=${styleMap({ width: `${this.width / 16}em`, right: this.minimised ? `-${this.width}px` : '' })}
      >
        ${this.hasParent
          ? undefined
          : html`
              <div
                class=${classMap({ 'minimise-button': true, 'minimise-button--minimised': this.minimised })}
                style=${styleMap({ right: this.minimised ? '' : `${this.width}px` })}
                @click=${() => {
                  this.minimised = !this.minimised
                  this.dispatchEvent(new Event('minimisetoggled', { detail: { minimised: this.minimised } }))
                }}
              ></div>
            `}
        <slot></slot>
      </div>
    `
  }
}

customElements.define('that-gui', ThatGuiComponent)
