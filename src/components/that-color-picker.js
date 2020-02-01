import { LitElement, html, css } from 'lit-element'
import { classMap } from 'lit-html/directives/class-map'
import { styleMap } from 'lit-html/directives/style-map'

class ThatColorPicker extends LitElement {
  constructor() {
    super()
    this.open = false
  }

  static get properties() {
    return {
      r: { type: Number },
      g: { type: Number },
      b: { type: Number },
      h: { type: Number },
      s: { type: Number },
      l: { type: Number },
      a: { type: Number },
      hex: { type: String },
      value: { type: Object },
      label: { type: String },
      options: { type: Array },
      type: { type: String },
      open: { type: Boolean },
    }
  }

  static get styles() {
    return css`
      :host {
        position: relative;
        display: inline-block;
        margin: 0 0.3em;
        width: 19.5em;
        font-size: 1em;
        cursor: pointer;
        --primary: 98, 0, 238;
        --surface: 255, 255, 255;
        --on-surface: 0, 0, 0;
      }

      .color:focus {
        outline: none;
      }

      .color__main {
        padding: 1em;
        height: 3em;
        border-radius: 0.25em 0.25em 0 0;
        background: rgb(var(--surface));
        transition: background-color 0.2s;
      }

      .color:focus .color__main {
        background: rgba(var(--on-surface), 0.07);
      }

      .color__text {
        float: left;
        text-align: left;
        cursor: text;
      }

      .color__label {
        font-size: 1em;
      }

      .color__value {
        font-size: 0.8em;
      }

      .color__dot {
        --color: var(--primary);
        box-sizing: border-box;
        height: 3em;
        width: 3em;
        border-radius: 50%;
        border: 0.125em solid rgba(var(--on-surface), 0.1);
        background: rgb(var(--color));
        box-shadow: 0 3px 4px 0 rgba(var(--color), 0.14), 0 3px 3px -2px rgba(var(--color), 0.12),
          0 1px 8px 0 rgba(var(--color), 0.2);
      }

      .color__main .color__dot {
        float: right;
      }

      .color__settings {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        transform: scale(0);
        transform-origin: top;
        background: rgb(var(--surface));
        border-radius: 0 0 0.25em 0.25em;
        box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12),
          0 5px 5px -3px rgba(0, 0, 0, 0.2);
        z-index: 1;
        transition: transform 0.2s;
      }

      .color__settings--open {
        transform: scale(1);
      }

      .color__options-container {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        padding: 1em;
      }

      .color__dot--swatch-option {
        display: inline-block;
        margin: 0.25em;
      }
    `
  }

  render() {
    const getCSSColor = value => {
      return `${Math.round(this.r * 255)}, ${Math.round(this.g * 255)}, ${Math.round(this.b * 255)}, ${this.a}`
    }

    return html`
      <div
        tabindex="0"
        class=${classMap({ color: true })}
        @click=${() => {
          this.open = !this.open
        }}
        @blur=${() => {
          this.open = false
        }}
      >
        <div class=${classMap({ color__main: true })}>
          <div class=${classMap({ color__text: true })}>
            <div class=${classMap({ color__label: true })}>${this.label}</div>
            <div class=${classMap({ color__value: true })}>
              ${typeof this.value == 'string'
                ? this.value.toUpperCase()
                : Object.keys(this.value).map(key => {
                    return `${key.toUpperCase() + this.value[key]} `
                  })}
            </div>
          </div>
          <div class=${classMap({ color__dot: true })} style=${styleMap({ '--color': getCSSColor(this.value) })}></div>
        </div>
        <div class=${classMap({ color__settings: true, 'color__settings--open': this.open })}>
          ${this.options.length > 0
            ? html`
                <div class=${classMap({ 'color__options-container': true })}>
                  ${this.options.map(option => {
                    return html`
                      <div
                        class=${classMap({ color__dot: true, 'color__dot--swatch-option': true })}
                        style=${styleMap({ '--color': getCSSColor(option) })}
                        title=${option}
                      ></div>
                    `
                  })}
                </div>
              `
            : ''}
        </div>
      </div>
    `
  }

  firstUpdated(changedProperties) {
    if (changedProperties.has('value')) {
      if (typeof this.value == 'string') {
        this.type = 'hex'
      } else if (this.value.r || this.value.g || this.value.b) {
        this.type = 'rgb'
      } else if (this.value.h || this.value.s || this.value.l) {
        this.type = 'hsl'
      }
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('value')) {
      switch (this.type) {
        case 'hex':
          this.hex = this.value
          break

        case 'rgb':
          this.r = this.value.r / 255
          this.g = this.value.g / 255
          this.b = this.value.b / 255
          this.a = this.value.a || 1
          break

        case 'hsl':
          this.h = this.value.h / 360
          this.s = this.value.s / 100
          this.l = this.value.l / 100
          this.a = this.value.a || 1
          break
      }

      this.dispatchEvent(new Event('change'))
    }

    if (changedProperties.has('r') || changedProperties.has('g') || changedProperties.has('b')) {
      this.hex =
        '#' +
        Math.round(this.r * 255)
          .toString(16)
          .padStart(2, '0') +
        Math.round(this.g * 255)
          .toString(16)
          .padStart(2, '0') +
        Math.round(this.b * 255)
          .toString(16)
          .padStart(2, '0') +
        (Math.round(this.a * 255) < 255
          ? Math.round(this.a * 255)
              .toString(16)
              .padStart(2, '0')
          : '')

      const rgbArray = [this.r, this.g, this.b]
      const min = Math.min(...rgbArray)
      const max = Math.max(...rgbArray)
      let h
      if (min == max) {
        h = 0
      } else if (rgbArray.indexOf(max) == 0) {
        h = (rgbArray[1] - rgbArray[2]) / (max - min)
      } else if (rgbArray.indexOf(max) == 1) {
        h = 2 + (rgbArray[2] - rgbArray[0]) / (max - min)
      } else {
        h = 4 + (rgbArray[0] - rgbArray[1]) / (max - min)
      }
      if (h < 0) h += 6

      this.h = h / 6
      this.l = (min + max) * 0.5
      this.s = min == max ? 0 : this.l < 0.5 ? (max - min) / (max + min) : (max - min) / (2 - max - min)
    }

    if (
      (changedProperties.has('h') || changedProperties.has('s') || changedProperties.has('l')) &&
      !['hex', 'r', 'g', 'b', 'a'].some(prop => {
        return changedProperties.has(prop)
      })
    ) {
      if (this.s == 0) {
        this.r = this.l
        this.g = this.l
        this.b = this.l
      } else {
        const temp1 = this.l < 0.5 ? this.l * (this.s + 1) : this.l + this.s - this.l * this.s
        const temp2 = this.l * 2 - temp1
        const rgb = { r: this.h + 1 / 3, g: this.h, b: this.h - 1 / 3 }
        for (const i in rgb) {
          if (rgb[i] < 0) {
            rgb[i] += 1
          } else if (rgb[i] > 1) {
            rgb[i] -= 1
          }
          if (rgb[i] * 6 < 1) {
            rgb[i] = temp2 + (temp1 - temp2) * rgb[i] * 6
          } else if (rgb[i] * 2 < 1) {
            rgb[i] = temp1
          } else if (rgb[i] * 3 < 2) {
            rgb[i] = temp2 + (temp1 - temp2) * (2 / 3 - rgb[i]) * 6
          } else {
            rgb[i] = temp2
          }
        }
        this.r = rgb.r
        this.g = rgb.g
        this.b = rgb.b
      }
    }

    if (
      changedProperties.has('hex') &&
      !['r', 'g', 'b', 'h', 's', 'l', 'a'].some(prop => {
        return changedProperties.has(prop)
      })
    ) {
      const valueStringArray = this.hex.slice(1).match(/.{2}/g)
      this.r = parseInt(valueStringArray[0], 16) / 255
      this.g = parseInt(valueStringArray[1], 16) / 255
      this.b = parseInt(valueStringArray[2], 16) / 255
      this.a = parseFloat((parseInt(valueStringArray[3], 16) / 255).toPrecision(2)) || 1
    }

    if (
      ['hex', 'r', 'g', 'b', 'h', 's', 'l', 'a'].some(prop => {
        return changedProperties.has(prop)
      })
    ) {
      switch (this.type) {
        case 'hex':
          this.value = this.hex
          break

        case 'rgb':
          this.value = {
            r: Math.round(this.r * 255),
            g: Math.round(this.g * 255),
            b: Math.round(this.b * 255),
            a: this.a || 1,
          }
          break

        case 'hsl':
          this.value = {
            h: Math.round(this.h * 360),
            s: Math.round(this.s * 100),
            l: Math.round(this.l * 100),
            a: this.a || 1,
          }
          break
      }
    }
  }
}

customElements.define('that-color-picker', ThatColorPicker)
