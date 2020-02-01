import { LitElement, html, css } from 'lit-element'
import { classMap } from 'lit-html/directives/class-map'
import { styleMap } from 'lit-html/directives/style-map'

class ThatColorPicker extends LitElement {
  constructor() {
    super()
    this.r = 255
    this.g = 255
    this.b = 255
    this.h = 0
    this.s = 0
    this.l = 100
    this.hex = '#ffffff'
    this.value = { r: 255, g: 255, b: 255 }
    this.label = ''
    this.options = []
    this.type = 'rgb'
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
        width: 20em;
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
        height: 2.5em;
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
        height: 2.5em;
        width: 2.5em;
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
      const v = this.convert_(value, this.type, 'rgb')
      return `${v.r}, ${v.g}, ${v.b + (v.a ? ', ' + v.a : '')}`
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
                  ${this.options.map((option, index) => {
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
    if (changedProperties.has('value')) this.dispatchEvent(new Event('change'))

    if (
      ['value', 'hex', 'r', 'g', 'b', 'h', 's', 'l', 'a'].some(prop => {
        return changedProperties.has(prop)
      })
    ) {
      if (this.label == 'hex') console.log(changedProperties)

      if (changedProperties.has('r') || changedProperties.has('g') || changedProperties.has('b')) {
        this.hex = `#${this.r.toString(16) + this.g.toString(16) + this.b.toString(16)}${this.a ? this.a.toString(16) : ''}`
      }

      if (changedProperties.has('h') || changedProperties.has('s') || changedProperties.has('l')) {
        this.r = this.h * 3
      }

      if (changedProperties.has('hex')) {
        //updateValue()
      }

      if (changedProperties.has('a')) {
        //updateValue()
      }
    }
  }

  convert_(value, fromType, toType) {
    if (fromType == toType) return value

    switch (fromType) {
      case 'hex':
        const valueStringArray = value.slice(1).match(/.{2}/g)
        const rgb = {
          r: parseInt(valueStringArray[0], 16),
          g: parseInt(valueStringArray[1], 16),
          b: parseInt(valueStringArray[2], 16),
          a: valueStringArray[3] ? parseInt(valueStringArray[3], 16) / 255 : 255,
        }

        if (toType == 'hsl') {
          return this.convert_(rgb, 'rgb', 'hsl')
        } else if (toType == 'rgb') {
          return rgb
        } else {
          return value
        }

      case 'rgb':
        if (toType == 'hex') {
          return `#${Object.keys(value)
            .map(key => {
              return Math.round(value[key] * (key == 'a' ? 255 : 1)).toString(16)
            })
            .join('')}`
        } else if (toType == 'hsl') {
          const rgbArray = [value.r / 255, value.g / 255, value.b / 255]
          const min = Math.min(...rgbArray)
          const max = Math.max(...rgbArray)
          const l = 100 * ((min + max) * 0.5)
          const s = 100 * (min == max ? 0 : l < 50 ? (max - min) / (max + min) : (max - min) / (2 - max - min))
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
          h *= 60

          return { h, s, l, a: value.a || 1 }
        } else {
          return value
        }

      case 'hsl':
        if (toType == 'hex') {
          return this.convert_(this.convert_(value, 'hsl', 'rgb'), 'rgb', 'hex')
        } else if (toType == 'rgb') {
          if (value.s == 0) {
            const v = value.l * 2.55
            return { r: v, g: v, b: v }
          } else {
            const h = value.h / 360
            const s = value.s / 100
            const l = value.l / 100
            const temp1 = l < 0.5 ? l * (s + 1) : l + s - l * s
            const temp2 = l * 2 - temp1
            const rgb = { r: h + 1 / 3, g: h, b: h - 1 / 3 }
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
              rgb[i] = Math.round(rgb[i] * 255)
            }
            rgb.a = value.a
            return rgb
          }
        } else {
          return value
        }

      default:
        return value
    }
  }
}

customElements.define('that-color-picker', ThatColorPicker)
