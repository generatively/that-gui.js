import { LitElement, html, css } from 'lit-element'
import { classMap } from 'lit-html/directives/class-map'
import { styleMap } from 'lit-html/directives/style-map'
import './that-tabbar'
import './that-slider'

class ThatColorPicker extends LitElement {
  constructor() {
    super()
    this.a = 1
    this.swatches = []
    this.noAlpha = false
    this.open = false
    this._currentTab = 'PICKER'
  }

  static get properties() {
    return {
      label: { type: String },
      swatches: { type: Array },
      type: { type: String },
      h: { type: Number },
      s: { type: Number },
      l: { type: Number },
      a: { type: Number },
      noAlpha: { type: Boolean },
      open: { type: Boolean },
      _currentTab: { type: String, attribute: false },
    }
  }

  get r() {
    return this._getRGBFromHSL('r')
  }

  set r(value) {
    this._setHSLFromRGB([value, this.g, this.b])
  }

  get g() {
    return this._getRGBFromHSL('g')
  }

  set g(value) {
    this._setHSLFromRGB([this.r, value, this.b])
  }

  get b() {
    return this._getRGBFromHSL('b')
  }

  set b(value) {
    this._setHSLFromRGB([this.r, this.g, value])
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
    if (value.toUpperCase() != '#FFFFFF') {
      const rgbArray = value
        .slice(1)
        .match(/.{2}/g)
        .map(val => {
          return parseInt(val, 16) / 255
        })
      this.a = rgbArray.length == 4 ? rgbArray.pop() : 1
      this._setHSLFromRGB(rgbArray)
    } else {
      if (!this.h) this.h = 0
      if (!this.s) this.s = 0
      this.l = 1
      this.a = 1
    }
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
        this._setHSLFromRGB([value.r / 255, value.g / 255, value.b / 255])
        this.a = value.a != undefined ? value.a : 1
        break

      case 'hsl':
        this.h = value.h / 360
        this.s = value.s / 100
        this.l = value.l / 100
        this.a = value.a != undefined ? value.a : 1
        break
    }
  }

  static get styles() {
    return css`
      :host {
        position: relative;
        display: inline-block;
        width: 19.5em;
        font-size: 1em;
        --primary: 265deg, 100%, 47%;
        --surface: 0deg, 0%, 100%;
        --on-surface: 0deg, 0%, 0%;
        user-select: none;
      }

      that-slider {
        width: initial;
      }

      that-input {
        width: calc(50% - 0.125em);
      }

      .color:focus {
        outline: none;
      }

      .color__main {
        position: relative;
        padding: 1em;
        height: 3em;
        border-radius: 0.25em;
        background: hsl(var(--surface));
        overflow: hidden;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .color:hover:not(:focus-within) .color__main {
        background: hsla(var(--on-surface), 0.06);
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
        transition: left 0.2s, transform 0.2s, text-align 0.2s, color 0.1s;
      }

      .color:focus-within .color__text {
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
      }

      .color__label {
        opacity: 0.7;
      }

      .color__value {
        white-space: nowrap;
      }

      .color__dot {
        --size: 3em;
        position: relative;
        box-sizing: border-box;
        height: var(--size);
        width: var(--size);
        border-radius: 50%;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
        background: white;
      }

      .color__main .color__dot {
        position: absolute;
        top: 2.5em;
        right: -0.5em;
        transform: translate(-50%, -50%);
        transition: transform 0.2s ease-out;
      }

      .color__settings-container {
        position: absolute;
        box-sizing: border-box;
        top: 100%;
        width: 100%;
        transform: scale(0);
        transform-origin: top;
        background: hsl(var(--surface));
        border-radius: 0.25em;
        box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12),
          0 5px 5px -3px rgba(0, 0, 0, 0.2);
        z-index: 1;
        overflow: hidden;
        transition: transform 0.2s;
      }

      .color:focus-within .color__settings-container {
        transform: scale(1);
        z-index: 2;
      }

      .color__settings {
        padding: 1em;
      }

      .color__gradient-box {
        position: relative;
        width: 17.5em;
        height: 17.5em;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        touch-action: none;
        cursor: pointer;
      }

      .color__gradient-box-pin {
        position: absolute;
        bottom: 0;
        left: 0;
        transform: translate(-50%, 50%);
        width: 0.75em;
        height: 0.75em;
        border-radius: 50%;
        background: white;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
        pointer-events: none;
        transition: width 0.2s, height 0.2s;
      }

      .color__gradient-box:active .color__gradient-box-pin {
        width: 1em;
        height: 1em;
      }

      .color__swatches-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
      }

      .color__dot--swatch {
        position: relative;
        display: inline-block;
        margin: 0.25em;
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .color__dot--swatch:focus {
        outline: none;
      }

      .color__dot--swatch:hover,
      .color__dot--swatch:focus {
        transform: scale(1.1);
        z-index: 1;
        box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
      }

      .color__delete-swatch {
        display: none;
        position: absolute;
        top: 0;
        right: 0;
        width: 1em;
        line-height: 1em;
        border-radius: 0.5em;
        color: white;
        background: red;
      }

      .color__dot--swatch:hover .color__delete-swatch {
        display: initial;
      }

      .color__dot--add-button {
        position: relative;
      }

      .color__dot--add-button::after {
        content: '+';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2em;
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
      if (m) this.s = (v - this.l) / m
    }

    const handleMouseUp = event => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleMouseMove)
      document.removeEventListener('touchend', handleMouseUp)
    }

    return html`
      <div
        tabindex="0"
        id="container"
        class=${classMap({ color: true })}
        @focusin=${() => (this.open = true)}
        @focusout=${() => (this.open = false)}
      >
        <div class=${classMap({ color__main: true })}>
          <div
            class=${classMap({ color__dot: true })}
            style=${styleMap({
              background: this.hex,
              transform: this.open
                ? `translate(-50%, -50%) scale(${this.clientWidth /
                    (parseFloat(getComputedStyle(this).fontSize) * 1.5)})`
                : '',
            })}
          ></div>
          <div
            class=${classMap({ color__text: true })}
            style=${styleMap({
              color: this.open
                ? this.a > 0.5 && this.l < 0.7
                  ? 'white'
                  : `hsl(${Math.round(this.h * 360)}deg, 100%, 25%)`
                : '',
            })}
          >
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
        <div class=${classMap({ 'color__settings-container': true })}>
          <that-tabbar
            value=${this._currentTab}
            even-widths
            @change=${event => (this._currentTab = event.target.value)}
            .options=${['PICKER', 'OPTIONS', 'SWATCHES']}
            class=${classMap({ color__tabbar: true })}
            style=${styleMap({ '--primary': `${Math.round(this.h * 360)}deg, ${Math.round(this.s * 100)}%, 50%` })}
          ></that-tabbar>
          <div class=${classMap({ color__settings: true })}>
            ${this._currentTab == 'SWATCHES'
              ? html`
                  <div class=${classMap({ 'color__swatches-container': true })}>
                    ${this.swatches.map((swatch, index) => {
                      return html`
                        <div
                          tabindex="0"
                          class=${classMap({ color__dot: true, 'color__dot--swatch': true })}
                          style=${styleMap({ background: swatch })}
                          title=${swatch}
                          @click=${event => {
                            if (event.target.classList.contains('color__delete-swatch')) return
                            this.hex = swatch
                          }}
                          @keyup=${event => {
                            switch (event.key) {
                              case 'Enter':
                                this.hex = swatch
                                return

                              case 'Delete':
                                this.swatches = this.swatches.filter((v, i) => i != index)
                                this.shadowRoot.getElementById('container').focus()
                                return

                              default:
                                return
                            }
                          }}
                        >
                          <div
                            class=${classMap({ 'color__delete-swatch': true })}
                            @click=${() => {
                              this.swatches = this.swatches.filter((v, i) => i != index)
                              this.shadowRoot.getElementById('container').focus()
                            }}
                          >
                            &times
                          </div>
                        </div>
                      `
                    })}
                    ${!this.swatches.includes(this.hex)
                      ? html`
                          <div
                            tabindex="0"
                            class=${classMap({
                              color__dot: true,
                              'color__dot--swatch': true,
                              'color__dot--add-button': true,
                            })}
                            style=${styleMap({
                              background: this.hex,
                              color:
                                this.l < 0.7 && this.a > 0.5
                                  ? 'white'
                                  : `hsl(${Math.round(this.h * 360)}deg, ${Math.round(this.s * 100)}%, 25%)`,
                            })}
                            title=${this.hex}
                            @click=${() => {
                              this.swatches = [...this.swatches, this.hex]
                              this.shadowRoot.getElementById('container').focus()
                            }}
                            @keypress=${event => {
                              if (event.key == 'Enter') {
                                this.swatches = [...this.swatches, this.hex]
                                this.shadowRoot.getElementById('container').focus()
                              }
                            }}
                          ></div>
                        `
                      : undefined}
                  </div>
                `
              : this._currentTab == 'OPTIONS'
              ? html`
                  <that-input
                    .value=${`${(Math.round(this.h * 3600) / 10).toFixed(1)}\u00B0, ${(
                      Math.round(this.s * 1000) / 10
                    ).toFixed(1)}%, ${(Math.round(this.l * 1000) / 10).toFixed(1)}%`}
                    @change=${event => {
                      const hsl = event.target.value.split(',').map(value => {
                        return parseFloat(value)
                      })
                      this.h = hsl[0] / 360
                      this.s = hsl[1] / 100
                      this.l = hsl[2] / 100
                    }}
                    label="HSL"
                    style=${styleMap({
                      '--primary': `${Math.round(this.h * 360)}deg, ${Math.round(this.s * 100)}%, ${
                        this.l < 0.5 ? Math.round(this.l * 100) : 50
                      }%`,
                    })}
                  ></that-input>
                  <that-input
                    .value=${`${Math.round(this.r * 255)}, ${Math.round(this.g * 255)}, ${Math.round(this.b * 255)}`}
                    @change=${event => {
                      const rgb = event.target.value.split(',').map(value => {
                        return parseFloat(value)
                      })
                      this.r = rgb[0] / 255
                      this.g = rgb[1] / 255
                      this.b = rgb[2] / 255
                    }}
                    label="RGB"
                    style=${styleMap({
                      '--primary': `${Math.round(this.h * 360)}deg, ${Math.round(this.s * 100)}%, ${
                        this.l < 0.5 ? Math.round(this.l * 100) : 50
                      }%`,
                    })}
                  ></that-input>
                  <that-input
                    .value=${this.hex.toUpperCase()}
                    @click=${event => (this.hex = event.target.value)}
                    @change=${event => {
                      let value = event.target.value
                      if (value.charAt(0) != '#') value = '#' + value
                      if (value.length < 7) return
                      this.hex = value
                    }}
                    label="HEX"
                    style=${styleMap({
                      '--primary': `${Math.round(this.h * 360)}deg, ${Math.round(this.s * 100)}%, ${
                        this.l < 0.5 ? Math.round(this.l * 100) : 50
                      }%`,
                    })}
                  ></that-input>
                  ${this.a != undefined
                    ? html`
                        <that-input
                          .value=${Math.round(this.a * 1000) / 1000}
                          label="ALPHA"
                          @change=${event => {
                            this.a = event.target.value
                          }}
                          style=${styleMap({
                            '--primary': `${Math.round(this.h * 360)}deg, ${Math.round(this.s * 100)}%, ${
                              this.l < 0.5 ? Math.round(this.l * 100) : 50
                            }%`,
                          })}
                        ></that-input>
                      `
                    : undefined}
                `
              : html`
                  <div
                    @mousedown=${event => {
                      handleMouseMove(event)
                      document.addEventListener('mousemove', handleMouseMove)
                      document.addEventListener('mouseup', handleMouseUp)
                    }}
                    @touchstart=${event => {
                      handleMouseMove(event)
                      document.addEventListener('touchmove', handleMouseMove)
                      document.addEventListener('touchend', handleMouseUp)
                    }}
                    id="gradientbox"
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
                      style=${styleMap({ bottom: `${v * 100}%`, left: `${(2 - (2 * this.l) / v) * 100}%` })}
                    ></div>
                  </div>
                  <that-slider
                    style=${styleMap({
                      '--track': `linear-gradient(to right, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080, #ff0000)`,
                      '--bar': 'none',
                      '--thumb': `hsl(${Math.round(this.h * 360)}deg, 100%, 45%)`,
                    })}
                    .maxValue=${Math.round(this.h * 3600) / 10}
                    @change=${event => {
                      this.h = event.target.maxValue / 360
                    }}
                    max="360"
                    step="0.1"
                    updateContinuously
                    hideValueTextField
                  ></that-slider>
                  ${this.a != undefined
                    ? html`
                        <that-slider
                          style=${styleMap({
                            '--track': `linear-gradient(to right, ${this.hex.slice(0, 7)}00, ${
                              this.l < 0.7
                                ? this.hex.slice(0, 7)
                                : `hsl(${Math.round(this.h * 360)}deg, ${Math.round(this.s * 100)}%, 70%)`
                            })`,
                            '--bar': 'none',
                            '--thumb':
                              this.l < 0.7
                                ? this.hex.slice(0, 7)
                                : `hsl(${Math.round(this.h * 360)}deg, ${Math.round(this.s * 100)}%, 70%)`,
                            '--on-thumb':
                              this.l < 0.7
                                ? 'white'
                                : `hsl(${Math.round(this.h * 360)}deg, ${Math.round(this.s * 100)}%, 25%)`,
                          })}
                          .maxValue=${Math.round(this.a * 1000) / 1000}
                          @change=${event => {
                            this.a = event.target.maxValue
                          }}
                          max="1"
                          step="0.001"
                          updateContinuously
                          hideValueTextField
                        ></that-slider>
                      `
                    : undefined}
                `}
          </div>
        </div>
      </div>
    `
  }

  firstUpdated(changedProperties) {
    if (['h', 's', 'l'].some(i => changedProperties.has(i))) {
      if (!this.swatches.includes(this.hex)) this.swatches.unshift(this.hex)
    }
  }

  updated(changedProperties) {
    if (['h', 's', 'l', 'a', 'swatches'].some(i => changedProperties.has(i))) {
      this.dispatchEvent(new Event('change'))
    }
  }

  _setHSLFromRGB(rgbArray) {
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

  _getRGBFromHSL(component) {
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
