import { LitElement, html, css } from 'lit-element'
import { classMap } from 'lit-html/directives/class-map'
import { styleMap } from 'lit-html/directives/style-map'
import './that-tabbar'
import './that-slider'

class ThatColorPicker extends LitElement {
  constructor() {
    super()
    this.a = 1
    this.noAlpha = false
  }

  static get properties() {
    return {
      label: { type: String },
      options: { type: Array },
      type: { type: String },
      h: { type: Number },
      s: { type: Number },
      l: { type: Number },
      a: { type: Number },
      noAlpha: { type: Boolean },
    }
  }

  get r() {
    if (this.s == 0) {
      return this.l
    } else {
      const temp1 = this.l < 0.5 ? this.l * (this.s + 1) : this.l + this.s - this.l * this.s
      const temp2 = this.l * 2 - temp1
      let r = this.h + 1 / 3

      if (r < 0) {
        r += 1
      } else if (r > 1) {
        r -= 1
      }

      if (r * 6 < 1) {
        r = temp2 + (temp1 - temp2) * r * 6
      } else if (r * 2 < 1) {
        r = temp1
      } else if (r * 3 < 2) {
        r = temp2 + (temp1 - temp2) * (2 / 3 - r) * 6
      } else {
        r = temp2
      }

      return isNaN(r) ? 1 : r
    }
  }

  set r(value) {
    this.setHSLFromRGB_([value, this.g, this.b])
  }

  get g() {
    if (this.s == 0) {
      return this.l
    } else {
      const temp1 = this.l < 0.5 ? this.l * (this.s + 1) : this.l + this.s - this.l * this.s
      const temp2 = this.l * 2 - temp1
      let g = this.h

      if (g < 0) {
        g += 1
      } else if (g > 1) {
        g -= 1
      }

      if (g * 6 < 1) {
        g = temp2 + (temp1 - temp2) * g * 6
      } else if (g * 2 < 1) {
        g = temp1
      } else if (g * 3 < 2) {
        g = temp2 + (temp1 - temp2) * (2 / 3 - g) * 6
      } else {
        g = temp2
      }

      return isNaN(g) ? 1 : g
    }
  }

  set g(value) {
    this.setHSLFromRGB_([this.r, value, this.b])
  }

  get b() {
    if (this.s == 0) {
      return this.l
    } else {
      const temp1 = this.l < 0.5 ? this.l * (this.s + 1) : this.l + this.s - this.l * this.s
      const temp2 = this.l * 2 - temp1
      let b = this.h - 1 / 3

      if (b < 0) {
        b += 1
      } else if (b > 1) {
        b -= 1
      }

      if (b * 6 < 1) {
        b = temp2 + (temp1 - temp2) * b * 6
      } else if (b * 2 < 1) {
        b = temp1
      } else if (b * 3 < 2) {
        b = temp2 + (temp1 - temp2) * (2 / 3 - b) * 6
      } else {
        b = temp2
      }

      return isNaN(b) ? 1 : b
    }
  }

  set b(value) {
    this.setHSLFromRGB_([this.r, this.g, value])
  }

  get hex() {
    return (
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
    )
  }

  set hex(value) {
    const rgbArray = value
      .slice(1)
      .match(/.{2}/g)
      .map(val => {
        return parseInt(val, 16) / 255
      })
    if (rgbArray.length == 4) this.a = rgbArray.pop()
    this.setHSLFromRGB_(rgbArray)
  }

  get value() {
    switch (this.type) {
      case 'hex':
        return this.hex

      case 'rgb':
        const rgb = {
          r: Math.round(this.r * 255),
          g: Math.round(this.g * 255),
          b: Math.round(this.b * 255),
        }
        if (!this.noAlpha) rgb.a = this.a
        return rgb

      case 'hsl':
        const hsl = {
          h: Math.round(this.h * 360),
          s: Math.round(this.s * 100),
          l: Math.round(this.l * 100),
        }
        if (!this.noAlpha) hsl.a = this.a
        return hsl

      default: 
        return '#FFFFFF'
    }
  }

  set value(value) {
    if (typeof value == 'string') {
      this.type = 'hex'
    } else if (value.r || value.g || value.b) {
      this.type = 'rgb'
    } else if (value.h || value.s || value.l) {
      this.type = 'hsl'
    }

    switch (this.type) {
      case 'hex':
        this.hex = value
        break

      case 'rgb':
        this.setHSLFromRGB_([value.r / 255, value.g / 255, value.b / 255])
        if (value.a) this.a = value.a
        break

      case 'hsl':
        this.h = value.h / 360
        this.s = value.s / 100
        this.l = value.l / 100
        if (value.a) this.a = value.a
        break
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
        border-radius: 0.25em;
        background: rgb(var(--surface));
        transition: background-color 0.2s;
      }

      .color:hover .color__main {
        background: rgba(var(--on-surface), 0.06);
      }

      .color:active .color__main {
        background: rgba(var(--on-surface), 0.11);
      }

      .color:focus-within:not(:active) .color__main {
        background: rgba(var(--on-surface), 0.1);
      }

      .color__text {
        float: left;
        text-align: left;
      }

      .color__label {
        font-size: 1em;
      }

      .color__value {
        font-size: 0.8em;
      }

      .color__dot {
        position: relative;
        box-sizing: border-box;
        height: 3em;
        width: 3em;
        border-radius: 50%;
        border: 0.125em solid rgba(var(--on-surface), 0.1);
        background: white;
      }

      .color__main .color__dot {
        float: right;
      }

      .color__settings {
        position: absolute;
        box-sizing: border-box;
        top: calc(100% - 0.25em);
        left: 0;
        width: 100%;
        padding: 1em;
        transform: scale(0);
        transform-origin: top;
        background: rgb(var(--surface));
        border-radius: 0.25em;
        box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12),
          0 5px 5px -3px rgba(0, 0, 0, 0.2);
        z-index: 2;
        transition: transform 0.2s;
      }

      .color__settings--open,
      .color:focus-within .color__settings {
        transform: scale(1);
      }

      .color__sliders {
        width: 100%;
      }

      .color__options-container {
        position: relative;
        display: flex;
        flex-wrap: wrap;
      }

      .color__dot--swatch-option {
        display: inline-block;
        margin: 0.25em;
      }
    `
  }

  render() {
    return html`
      <div tabindex="0" class=${classMap({ color: true })}>
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
          <div class=${classMap({ color__dot: true })} style=${styleMap({ background: this.hex })}></div>
        </div>
        <div class=${classMap({ color__settings: true })}>
          <that-slider
            .maxValue=${Math.round(this.r * 255)}
            @change=${event => {
              this.r = event.target.maxValue / 255
            }}
            label="R"
            max="255"
            step="1"
            updateContinuously
          ></that-slider>
          <that-slider
            .maxValue=${Math.round(this.g * 255)}
            @change=${event => {
              this.g = event.target.maxValue / 255
            }}
            label="G"
            max="255"
            step="1"
            updateContinuously
          ></that-slider>
          <that-slider
            .maxValue=${Math.round(this.b * 255)}
            @change=${event => {
              this.b = event.target.maxValue / 255
            }}
            label="B"
            max="255"
            step="1"
            updateContinuously
          ></that-slider>
          <that-slider
            .maxValue=${Math.round(this.h * 3600) / 10}
            @change=${event => {
              this.h = event.target.maxValue / 360
            }}
            label="H"
            max="360"
            step="0.1"
            updateContinuously
          ></that-slider>
          <that-slider
            .maxValue=${Math.round(this.s * 1000) / 10}
            @change=${event => {
              this.s = event.target.maxValue / 100
            }}
            label="S"
            max="100"
            step="0.1"
            updateContinuously
          ></that-slider>
          <that-slider
            .maxValue=${Math.round(this.l * 1000) / 10}
            @change=${event => {
              this.l = event.target.maxValue / 100
            }}
            label="L"
            max="100"
            step="0.1"
            updateContinuously
          ></that-slider>
          ${this.a
            ? html`
                <that-slider
                  .maxValue=${Math.round(this.a * 1000) / 1000}
                  @change=${event => {
                    this.a = event.target.maxValue
                  }}
                  label="A"
                  max="1"
                  step="0.001"
                  updateContinuously
                ></that-slider>
              `
            : ''}
          ${this.options.length > 0
            ? html`
                <div class=${classMap({ 'color__options-container': true })}>
                  ${this.options.map(option => {
                    return html`
                      <div
                        class=${classMap({ color__dot: true, 'color__dot--swatch-option': true })}
                        style=${styleMap({ background: option })}
                        title=${option}
                        @click=${() => (this.value = option)}
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

  updated(changedProperties) {
    if (
      ['h', 's', 'l', 'a'].some(i => {
        return changedProperties.has(i)
      })
    ) {
      this.dispatchEvent(new Event('change'))
    }
  }

  setHSLFromRGB_(rgbArray) {
    const min = Math.min(...rgbArray)
    const max = Math.max(...rgbArray)
    const l = (min + max) * 0.5
    const s = min == max ? 0 : l < 0.5 ? (max - min) / (max + min) : (max - min) / (2 - max - min)
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
    h /= 6

    this.l = l
    this.s = s
    this.h = h
  }
}

customElements.define('that-color-picker', ThatColorPicker)
