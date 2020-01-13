import { LitElement, html, css, unsafeCSS } from 'lit-element'
import { classMap } from 'lit-html/directives/class-map'
import { styleMap } from 'lit-html/directives/style-map'
import { mainStyle } from '../styles/index'

class ThatSlider extends LitElement {
  constructor() {
    super()
    this.value = 0
    this.min = 0
    this.max = 100
    this.step = 0
    this.label = ''
  }

  static get properties() {
    return {
      value: { type: Number },
      min: { type: Number },
      max: { type: Number },
      step: { type: Number },
      label: { type: String },
    }
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
        vertical-align: middle;
        user-select: none;
      }

      .slider {
        display: inline-block;
        position: relative;
        height: 48px;
        width: 280px;
      }

      .slider:focus {
        outline: none;
      }

      .slider__track {
        pointer-events: none;
        position: absolute;
        top: 50%;
        left: 16px;
        transform: translateY(-50%);
        width: calc(100% - 32px);
        height: 2px;
        background: ${unsafeCSS(mainStyle.primary)}3d;
      }

      .slider__bar {
        height: 2px;
        background: ${unsafeCSS(mainStyle.primary)};
        transform-origin: left;
      }

      .slider__thumb-container {
        position: absolute;
        top: 50%;
      }

      .slider__thumb {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 12px;
        height: 12px;
        border-radius: 16px;
        background: ${unsafeCSS(mainStyle.primary)};
        transition: width 0.1s, height 0.1s;
      }

      .slider:active .slider__thumb {
        width: 16px;
        height: 16px;
      }

      .slider__focus-ring {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 0;
        height: 0;
        border-radius: 24px;
        background: ${unsafeCSS(mainStyle.primary)}30;
        opacity: 0;
        transition: width 0.1s, height 0.1s, opacity 0.1s;
      }

      .slider:focus .slider__focus-ring {
        opacity: 1;
        width: 32px;
        height: 32px;
      }

      .slider__value-container {

      }

      .slider__value-pin {
      }

      .slider__value-text {
      }
    `
  }

  render() {
    return html`
      <!-- <span class=${classMap({ label: true })}>${this.label}</span> -->
      <div class=${classMap({ slider: true })}>
        <div tabindex="0" class=${classMap({ slider__track: true })}>
          <div
            class=${classMap({ slider__bar: true })}
            style=${styleMap({ transform: `scaleX(${this.scale(this.value, this.min, this.max, 0, 1)})` })}
          ></div>
          <div
            class=${classMap({ 'slider__thumb-container': true })}
            style=${styleMap({ transform: `translateX(${this.scale(this.value, this.min, this.max, 0, 248)}px)` })}
          >
            <div class=${classMap({ 'slider__value-container': true })}>
              <div class=${classMap({ 'slider__value-pin': true })}></div>
              <span class=${classMap({ 'slider__value-text': true })}></span>
            </div>
            <div class=${classMap({ 'slider__focus-ring': true })}></div>
            <div class=${classMap({ slider__thumb: true })}></div>
          </div>
        </div>
      </div>
    `
  }

  firstUpdated(changedProperties) {
    this.addListeners()
  }

  updated(changedProperties) {
    if (changedProperties.has('value')) {
      this.dispatchEvent(new Event('change'))
    }
  }

  scale(number, inMin, inMax, outMin, outMax) {
    return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
  }

  addListeners() {
    const that = this

    const handleMouseDown = event => {
      if (event.buttons == 1) {
        handleMove(event)
        
        document.addEventListener('mousemove', handleMove)
        document.addEventListener('mouseup', handleMouseUp)
      }
    }

    const handleMouseUp = event => {
      if (event.buttons == 0) {
        document.removeEventListener('mousemove', handleMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }

    const handlePointerDown = event => {
      handleMove(event)
      
      document.addEventListener('pointermove', handleMove)
      document.addEventListener('pointerup', handlePointerUp)
    }

    const handlePointerUp = event => {
      document.removeEventListener('pointermove', handleMove)
      document.removeEventListener('pointerup', handlePointerUp)
    }

    const handleTouchStart = event => {
      this.addEventListener('touchmove', handleMove)
      this.addEventListener('touchend', handleTouchEnd)
      
      handleMove(event)
    }

    const handleTouchEnd = event => {
      this.removeEventListener('touchmove', handleMove)
      this.removeEventListener('touchend', handleTouchEnd)
    }

    const handleMove = event => {
      // event.type == 'touchmove' ? handleTouchEnd(event) : handleMouseUp(event)
      const elemRect = that.getBoundingClientRect()
      const pos = getPos(event, elemRect)
      if (pos <= 16) {
        that.value = that.min
      } else if (pos >= elemRect.width - 16) {
        that.value = that.max
      } else {
        let newValue = that.scale((pos - 16) / (elemRect.width - 32), 0, 1, that.min, that.max)
        newValue = newValue - (newValue % that.step)
        that.value = newValue.toPrecision(12)
      }
    }

    const getPos = (event, elemRect) => {
      return (
        (event.type == 'touchmove' || event.type == 'touchstart' ? event.targetTouches[0].pageX : event.pageX) -
        elemRect.left +
        (window.pageXOffset || document.documentElement.scrollLeft)
      )
    }

    this.addEventListener('mousedown', handleMouseDown)
    // this.addEventListener('pointerdown', handlePointerDown)
    this.addEventListener('touchstart', handleTouchStart)
  }
}

customElements.define('that-slider', ThatSlider)
