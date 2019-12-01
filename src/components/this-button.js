import { LitElement, html, css } from 'lit-element'
import { store } from '../store'
import '../styles'

class ThisButton extends LitElement {
  render() {
    return html`
      <button><slot></slot></button>
    `
  }

  static get styles() { 
    return css`
      :host {
        --font-family: Alata, Verdana, sans-serif;
        --primary-color: hsl(175, 50%, 60%);
        --secondary-color: hsl(190, 100%, 80%);
        --tertiary-color: hsl(350, 50%, 60%);
        --text-color: hsl(225, 30%, 20%);
        display: inline-block;
        margin: 5pt;
      }
      button {
        display: inline;
        background: var(--primary-color);
        color: var(--text-color);
        outline: none;
        border: none;
        padding: 12pt;
        min-width: 30pt;
        min-height: 30pt;
        text-align: center;
        vertical-align: middle;
        font-size: 12pt;
        font-family: var(--font-family);
        border-radius: 100vmax;
        box-shadow: 0 1pt 5pt -1pt var(--primary-color), 0 1pt 5pt -1pt #0003;
        transition: transform 0.2s, box-shadow 0.3s;
      }
      
      button:hover {
        box-shadow: 0 2pt 10pt -3pt var(--primary-color), 0 2pt 10pt -1pt #0003;
      }

      button:active {
        box-shadow: 0 2pt 10pt -1pt var(--primary-color), 0 2pt 10pt -1pt #0003;
        background: white;
      }
    `
  }
}

customElements.define('this-button', ThisButton)