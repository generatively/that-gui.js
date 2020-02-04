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
    return this.getRGBFromHSL_('r')
  }

  set r(value) {
    this.setHSLFromRGB_([value, this.g, this.b])
  }

  get g() {
    return this.getRGBFromHSL_('g')
  }

  set g(value) {
    this.setHSLFromRGB_([this.r, value, this.b])
  }

  get b() {
    return this.getRGBFromHSL_('b')
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
      if (value == this.value) return
      this.type = 'hex'
    } else if (value.r || value.g || value.b) {
      if (
        Math.round(this.r * 255) == value.r &&
        Math.round(this.g * 255) == value.g &&
        Math.round(this.b * 255) == value.b
      )
        return
      this.type = 'rgb'
    } else if (value.h || value.s || value.l) {
      if (
        Math.round(this.h * 360) == value.h &&
        Math.round(this.s * 100) == value.s &&
        Math.round(this.l * 100) == value.l
      )
        return
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
        user-select: none;
      }

      that-slider {
        width: 100%;
      }

      .color:focus {
        outline: none;
      }

      .color__main {
        position: relative;
        padding: 1em;
        height: 3em;
        border-radius: 0.25em;
        background: rgb(var(--surface));
        overflow: hidden;
        transition: background-color 0.2s;
      }

      .color:hover:not(:focus-within) .color__main {
        background: rgba(var(--on-surface), 0.06);
      }

      .color__text {
        position: absolute;
        top: 50%;
        left: 1em;
        padding: 0.5em 0;
        transform: translateY(-50%);
        line-height: 1.2em;
        text-align: left;
        border-radius: 0.25em;
        transition: background-color 0.2s, padding 0.2s, left 0.2s, transform 0.2s, text-align 0.2s, box-shadow 0.2s;
      }

      .color:focus-within .color__text {
        padding: 0.5em 0.75em;
        background: white;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14), 0 3px 3px -2px rgba(0, 0, 0, 0.12), 0 1px 8px 0 rgba(0, 0, 0, 0.2);
      }

      .color__label {
        color: rgba(var(--on-surface), 0.7);
        transition: color 0.2s;
      }

      .color:focus-within .color__label {
        color: rgb(var(--primary));
      }

      .color__value {
        white-space: nowrap;
      }

      .color__dot {
        position: relative;
        box-sizing: border-box;
        height: 3em;
        width: 3em;
        border-radius: 50%;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
        background: white;
      }

      .color__main .color__dot {
        position: absolute;
        top: 2.5em;
        right: -0.5em;
        transform: translate(-50%, -50%);
        transition: transform 0.2s;
      }

      .color:focus-within .color__main .color__dot {
        transform: translate(-50%, -50%) scale(13);
      }

      .color__settings {
        position: absolute;
        box-sizing: border-box;
        top: 100%;
        left: 0;
        width: 100%;
        padding: 1em;
        transform: scale(0);
        transform-origin: top;
        background: rgb(var(--surface));
        border-radius: 0.25em;
        box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12),
          0 5px 5px -3px rgba(0, 0, 0, 0.2);
        z-index: 1;
        transition: transform 0.2s;
      }

      .color__settings--open,
      .color:focus-within .color__settings {
        transform: scale(1);
        z-index: 2;
      }

      .color__gradient-box {
        position: relative;
        width: 10em;
        height: 10em;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        touch-action: none;
      }

      .color__gradient-box-pin {
        position: absolute;
        bottom: 0;
        left: 0;
        transform: translate(-50%, -50%);
        width: 0.75em;
        height: 0.75em;
        border-radius: 50%;
        background: white;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
        pointer-events: none;
      }

      .color__options-container {
        border-top: 0.0625em solid rgba(var(--on-surface), 0.1);
        padding-top: 1em;
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
    const v = this.s * Math.min(this.l, 1 - this.l) + this.l

    const handleMouseMove = event => {
      const elemRect = this.shadowRoot.getElementById('gradientbox').getBoundingClientRect()
      let s =
        ((event.type == 'touchmove' || event.type == 'touchstart' ? event.targetTouches[0].pageX : event.pageX) -
          elemRect.left) /
        elemRect.width
      if (s < 0) s = 0
      if (s > 1) s = 1
      let v =
        1 -
        ((event.type == 'touchmove' || event.type == 'touchstart' ? event.targetTouches[0].pageY : event.pageY) -
          elemRect.top) /
          elemRect.height
      if (v < 0) v = 0
      if (v > 1) v = 1
      this.l = v - (v * s) / 2
      const m = Math.min(this.l, 1 - this.l)
      this.s = m ? (v - this.l) / m : 0
    }

    const handleMouseUp = event => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleMouseMove)
      document.removeEventListener('touchend', handleMouseUp)
    }

    return html`
      <div tabindex="0" class=${classMap({ color: true })}>
        <div class=${classMap({ color__main: true })}>
          <div class=${classMap({ color__dot: true })} style=${styleMap({ background: this.hex })}></div>
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
        </div>
        <div class=${classMap({ color__settings: true })}>
          <div
            @click=${handleMouseMove}
            @mousedown=${event => {
              document.addEventListener('mousemove', handleMouseMove)
              document.addEventListener('mouseup', handleMouseUp)
            }}
            @touchstart=${event => {
              document.addEventListener('touchmove', handleMouseMove)
              document.addEventListener('touchend', handleMouseUp)
            }}
            id='gradientbox'
            class=${classMap({ 'color__gradient-box': true })}
            style=${styleMap({
              background: `
                linear-gradient(rgba(0, 0, 0, 0), black), 
                linear-gradient(to left, hsl(${Math.round(this.h * 360)}deg, 100%, 50%), white)
              `,
            })}
          >
            <div
              class=${classMap({ 'color__gradient-box-pin': true })}
              style=${styleMap({ bottom: `calc(${v * 100}% - 1em)`, left: `${(2 - (2 * this.l) / v) * 100}%` })}
            ></div>
          </div>
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
          ${this.a != undefined
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
    if (rgbArray[0] == this.r && rgbArray[1] == this.g && rgbArray[2] == this.b) return
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

    this.h = h
    this.s = s
    this.l = l
  }

  getRGBFromHSL_(component) {
    if (this.s == 0) {
      return this.l
    } else {
      const temp1 = this.l < 0.5 ? this.l * (this.s + 1) : this.l + this.s - this.l * this.s
      const temp2 = this.l * 2 - temp1
      let value = this.h

      switch (component) {
        case 'g':
          break

        case 'r':
          value += 1 / 3
          break

        case 'b':
          value -= 1 / 3
          break
      }

      if (value < 0) {
        value += 1
      } else if (value > 1) {
        value -= 1
      }

      if (value * 6 < 1) {
        value = temp2 + (temp1 - temp2) * value * 6
      } else if (value * 2 < 1) {
        value = temp1
      } else if (value * 3 < 2) {
        value = temp2 + (temp1 - temp2) * (2 / 3 - value) * 6
      } else {
        value = temp2
      }

      return isNaN(value) ? 1 : value
    }
  }
}

customElements.define('that-color-picker', ThatColorPicker)
