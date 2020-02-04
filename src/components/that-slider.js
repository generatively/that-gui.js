import { LitElement, html, css } from 'lit-element'
import { classMap } from 'lit-html/directives/class-map'
import { styleMap } from 'lit-html/directives/style-map'

class ThatSlider extends LitElement {
  constructor() {
    super()
    this.maxValue = 0
    this.min = 0
    this.max = 100
    this.step = 0.1
    this.label = ''
    this.hideValueTextField = false
    this.updateContinuously = false
    this.currentThumb_ = true
  }

  static get properties() {
    return {
      minValue: { type: Number },
      maxValue: { type: Number },
      minDiff: { type: Number },
      maxDiff: { type: Number },
      min: { type: Number },
      max: { type: Number },
      step: { type: Number },
      label: { type: String },
      hideValueTextField: { type: Boolean },
      updateContinuously: { type: Boolean },
      currentThumb_: { type: Boolean },
    }
  }

  static get styles() {
    return css`
      :host {
        --primary: 98, 0, 238;
        --surface: 255, 255, 255;
        --on-primary: 255, 255, 255;
        --on-surface: 0, 0, 0;
        display: flex;
        background: rgb(var(--surface));
        color: rgb(var(--on-surface));
        font-size: 1em;
        border-radius: 0.25em;
        width: 17.5em;
      }

      .label {
        flex-grow: 0;
        line-height: 3em;
      }

      .slider {
        display: inline-block;
        position: relative;
        flex-grow: 1;
        height: 3em;
        cursor: pointer;
        vertical-align: middle;
        user-select: none;
      }

      .slider__track {
        position: absolute;
        top: 50%;
        left: 0.8em;
        transform: translateY(-50%);
        width: calc(100% - 1.6em);
        height: 0.125em;
        background: rgba(var(--primary), 0.239);
        touch-action: none;
        pointer-events: none;
      }

      .slider__bar {
        position: relative;
        height: 0.125em;
        background: rgb(var(--primary));
        transform-origin: left;
      }

      .slider__thumb-container {
        position: absolute;
        top: 50%;
      }

      .slider__thumb-container:focus-within {
        z-index: 1;
      }

      .slider__thumb {
        pointer-events: initial;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 0.75em;
        height: 0.75em;
        border-radius: 0.75em;
        background: rgb(var(--primary));
        transition: transform 0.1s;
      }

      .slider__thumb:focus {
        outline: none;
        transform: translate(-50%, -50%) scale(1.34);
      }

      .slider__focus-ring {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%) scale(0);
        width: 2em;
        height: 2em;
        border-radius: 1em;
        background: rgba(var(--primary), 0.188);
        opacity: 0;
        transition: transform 0.1s, opacity 0.1s;
      }

      .slider__thumb:focus + .slider__focus-ring,
      .slider__thumb:active + .slider__focus-ring {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }

      .slider__value-container {
        position: absolute;
        transform: translate(-50%, calc(-50%)) scale(0);
        transform-origin: bottom;
        transition: transform 0.1s;
      }

      .slider:hover .slider__value-container,
      .slider__thumb:focus ~ .slider__value-container {
        transform: translate(-50%, calc(-50% - 0.9em)) scale(1);
      }

      .slider__value-arrow {
        width: 0.5em;
        height: 0.5em;
        background-color: rgb(var(--primary));
        transform: rotate(45deg);
      }

      .slider__value-text {
        position: absolute;
        left: 50%;
        top: 0;
        min-width: 1.125em;
        height: 1.125;
        line-height: 1.125em;
        padding: 0.3em 0.63em;
        border-radius: 0.25em;
        transform: translate(-50%, calc(-50% - 0.6em));
        font-size: 1em;
        text-align: center;
        background-color: rgb(var(--primary));
        color: rgb(var(--on-primary));
      }

      .slider__input {
        width: 3em;
        font-size: 1em;
        border: none;
        margin-right: 0.4em;
        text-align: center;
        background: none;
      }

      .slider__input:focus {
        outline: none;
      }
    `
  }

  render() {
    return html`
      <span class=${classMap({ label: true })}>${this.label}</span>
      <div id="slider" class=${classMap({ slider: true })}>
        <div id="track" class=${classMap({ slider__track: true })}>
          <div
            class=${classMap({ slider__bar: true })}
            style=${styleMap({
              left: this.minValue != undefined ? `${this.scale_(this.minValue, this.min, this.max, 0, 100)}%` : '',
              transform: `scaleX(${this.scale_(
                this.maxValue - (this.minValue != undefined ? this.minValue : 0),
                this.min,
                this.max,
                0,
                1,
              )})`,
            })}
          ></div>
          ${this.minValue != undefined
            ? html`
                <div
                  class=${classMap({ 'slider__thumb-container': true })}
                  style=${styleMap({ left: `${this.scale_(this.minValue, this.min, this.max, 0, 100)}%` })}
                >
                  <div tabindex="0" id="min" class=${classMap({ slider__thumb: true })}></div>
                  <div class=${classMap({ 'slider__focus-ring': true })}></div>
                  <div class=${classMap({ 'slider__value-container': true })}>
                    <div class=${classMap({ 'slider__value-arrow': true })}></div>
                    <div class=${classMap({ 'slider__value-text': true })}>${this.minValue}</div>
                  </div>
                </div>
              `
            : ''}
          <div
            class=${classMap({ 'slider__thumb-container': true })}
            style=${styleMap({ left: `${this.scale_(this.maxValue, this.min, this.max, 0, 100)}%` })}
          >
            <div tabindex="0" id="max" class=${classMap({ slider__thumb: true })}></div>
            <div class=${classMap({ 'slider__focus-ring': true })}></div>
            <div class=${classMap({ 'slider__value-container': true })}>
              <div class=${classMap({ 'slider__value-arrow': true })}></div>
              <div class=${classMap({ 'slider__value-text': true })}>${this.maxValue}</div>
            </div>
          </div>
        </div>
      </div>
      ${this.hideValueTextField
        ? ''
        : html`
            <input
              .value=${this.currentThumb_ ? this.maxValue : this.minValue}
              class=${classMap({ slider__input: true })}
              style=${styleMap({ width: `${String(this.step + this.max).length + (this.min < 0 ? 1.5 : 1)}ex` })}
              @change=${event => {
                const newValue = Number(event.target.value)
                if (!isNaN(newValue)) this.updateValue_(newValue)
                this.requestUpdate(this.currentThumb_ ? 'maxValue' : 'minValue')
                event.target.value = this[this.currentThumb_ ? 'maxValue' : 'minValue']
              }}
            />
          `}
    `
  }

  firstUpdated(changedProperties) {
    this.setupEventListeners_()
  }

  updated(changedProperties) {
    if (this.minValue != undefined && (changedProperties.has('maxValue') || changedProperties.has('minValue'))) {
      if (this.maxValue - this.minValue < 0) {
        const minValue = this.minValue
        this.minValue = this.maxValue
        this.maxValue = minValue
      }

      // if (this.minDiff != undefined && Math.abs(this.maxValue - this.minValue) < this.minDiff) {
      //   this.minValue = this.maxValue - this.minDiff
      // }

      // if (this.maxDiff != undefined && Math.abs(this.maxValue - this.minValue) > this.maxDiff) {
      //   this.minValue = this.maxValue - this.maxDiff
      // }
    }
  }

  scale_(number, inMin, inMax, outMin, outMax) {
    return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
  }

  updateValue_(newValue) {
    this[this.currentThumb_ ? 'maxValue' : 'minValue'] = parseFloat(newValue.toPrecision(12))

    if ((this.currentThumb_ ? this.maxValue : this.minValue) > this.max)
      this[this.currentThumb_ ? 'maxValue' : 'minValue'] = this.max
    if ((this.currentThumb_ ? this.maxValue : this.minValue) < this.min)
      this[this.currentThumb_ ? 'maxValue' : 'minValue'] = this.min

    if (
      this[this.currentThumb_ ? 'maxValue' : 'minValue'] == this.max ||
      this[this.currentThumb_ ? 'maxValue' : 'minValue'] == this.min
    )
      return

    this.dispatchEvent(new Event('change'))
  }

  setupEventListeners_() {
    const that = this
    const sliderElem = this.shadowRoot.getElementById('slider')
    const trackElem = this.shadowRoot.getElementById('track')
    const minThumbElem = this.shadowRoot.getElementById('min')
    const maxThumbElem = this.shadowRoot.getElementById('max')

    const getMousePos = event => {
      return event.type == 'touchmove' || event.type == 'touchstart' ? event.targetTouches[0].pageX : event.pageX
    }

    const updateClosestThumb = event => {
      const mousePos = getMousePos(event)
      if (
        minThumbElem != undefined &&
        Math.abs(mousePos - minThumbElem.getBoundingClientRect().left) <
          Math.abs(mousePos - maxThumbElem.getBoundingClientRect().left)
      ) {
        window.setTimeout(() => {
          minThumbElem.focus()
        }, 0)
        this.currentThumb_ = false
      } else {
        window.setTimeout(() => {
          maxThumbElem.focus()
        }, 0)
        this.currentThumb_ = true
      }
    }

    const handleMouseDown = event => {
      if (event.buttons == 1) {
        updateClosestThumb(event)
        handleMove(event)
        document.addEventListener('mousemove', handleMove)
        document.addEventListener('mouseup', handleMouseUp)
      }
    }

    const handleMouseUp = event => {
      if (event.buttons == 0) {
        this.dispatchEvent(new Event('change'))
        document.removeEventListener('mousemove', handleMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }

    const handleMouseOver = event => {
      sliderElem.addEventListener('wheel', handleWheel)
      sliderElem.addEventListener('mouseout', handleMouseOut)
    }

    const handleMouseOut = event => {
      sliderElem.removeEventListener('wheel', handleWheel)
      sliderElem.removeEventListener('mouseout', handleMouseOut)
    }

    const handleTouchStart = event => {
      updateClosestThumb(event)
      handleMove(event)
      sliderElem.addEventListener('touchmove', handleMove)
      sliderElem.addEventListener('touchend', handleTouchEnd)
    }

    const handleTouchEnd = event => {
      this.dispatchEvent(new Event('change'))
      sliderElem.removeEventListener('touchmove', handleMove)
      sliderElem.removeEventListener('touchend', handleTouchEnd)
    }

    const handleWheel = event => {
      if (event.altKey) {
        event.preventDefault()
        updateClosestThumb(event)
        const newValue =
          (this.currentThumb_ ? this.maxValue : this.minValue) +
          (-event.deltaY > 0 ? this.step : -this.step) * (event.shiftKey ? 10 : 1)
        this.updateValue_(newValue)
      }
    }

    const handleKeyDown = event => {
      if (
        !['Escape', 'ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'PageUp', 'PageDown', 'Home', 'End'].includes(
          event.key,
        )
      )
        return

      event.preventDefault()

      let stepMultiplier = event.shiftKey ? 10 : 1

      switch (event.key) {
        case 'Escape':
          this.currentThumb_ ? maxThumbElem.blur() : minThumbElem.blur()
          return

        case 'Home':
          this.currentThumb_ ? (this.maxValue = this.min) : (this.minValue = this.min)
          return

        case 'End':
          this.currentThumb_ ? (this.maxValue = this.max) : (this.minValue = this.max)
          return

        case 'ArrowRight':
        case 'ArrowUp':
          break

        case 'ArrowLeft':
        case 'ArrowDown':
          stepMultiplier *= -1
          break

        case 'PageUp':
          stepMultiplier *= 10
          break

        case 'PageDown':
          stepMultiplier *= -10
          break
      }

      const stepAmount = this.step * stepMultiplier

      this.updateValue_(this[this.currentThumb_ ? 'maxValue' : 'minValue'] + stepAmount)
    }

    const handleMove = event => {
      const pos =
        getMousePos(event) -
        trackElem.getBoundingClientRect().left +
        (window.pageXOffset || document.documentElement.scrollLeft)
      let newValue

      if (pos <= 0) {
        newValue = that.min
      } else if (pos >= trackElem.clientWidth) {
        newValue = that.max
      } else {
        newValue = that.scale_(pos / trackElem.clientWidth, 0, 1, that.min, that.max)
      }

      that[this.currentThumb_ ? 'maxValue' : 'minValue'] = parseFloat(
        (that.step == 0 ? newValue : Math.ceil(newValue / that.step) * that.step).toPrecision(12),
      )

      if (this.updateContinuously) this.dispatchEvent(new Event('change'))
    }

    if (minThumbElem) {
      minThumbElem.addEventListener('keydown', handleKeyDown)
    }
    maxThumbElem.addEventListener('keydown', handleKeyDown)
    sliderElem.addEventListener('mousedown', handleMouseDown)
    sliderElem.addEventListener('touchstart', handleTouchStart)
    sliderElem.addEventListener('mouseover', handleMouseOver)
  }
}

customElements.define('that-slider', ThatSlider)
