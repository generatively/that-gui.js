import { LitElement, html } from 'lit-element';

class GuiContainer extends LitElement {

  render(){
    return html`
      <div>
        <p>A paragraph</p>
      </div>
    `;
  }
}
customElements.define('gui-container', GuiContainer);