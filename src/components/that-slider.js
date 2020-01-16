import { LitElement, html, css } from 'lit-element'
import { classMap } from 'lit-html/directives/class-map'
import { styleMap } from 'lit-html/directives/style-map'
import { theme } from '../styles/index'

class ThatSlider extends LitElement {
  constructor() {
    super()
    this.maxValue = 0
    this.min = 0
    this.max = 100
    this.step = 0
    this.label = ''
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
    }
  }

  static get styles() {
    return css`
      :host {
        display: inline-flex;
        background: rgb(var(--surface));
        color: rgb(var(--on-surface));
        font-size: 1em;
        border-radius: 0.25em;
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
        touch-action: none;
        user-select: none;
      }

      .slider:focus {
        outline: none;
      }

      .slider__track {
        pointer-events: none;
        position: absolute;
        top: 50%;
        left: 0.5em;
        transform: translateY(-50%);
        width: calc(100% - 1em);
        height: 0.125em;
        background: rgba(var(--primary), 0.239);
      }

      .slider__bar {
        height: 0.125em;
        background: rgb(var(--primary));
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
        width: 0.75em;
        height: 0.75em;
        border-radius: 0.75em;
        background: rgb(var(--primary));
        transition: width 0.1s, height 0.1s;
      }

      .slider:active .slider__thumb {
        width: 1em;
        height: 1em;
      }

      .slider__focus-ring {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 0;
        height: 0;
        border-radius: 1em;
        background: rgba(var(--primary), 0.188);
        opacity: 0;
        transition: width 0.1s, height 0.1s, opacity 0.1s;
      }

      .slider:focus .slider__focus-ring,
      .slider:active .slider__focus-ring {
        opacity: 1;
        width: 2em;
        height: 2em;
      }

      .slider__value-container {
        position: absolute;
        transform: translate(-50%, calc(-50%)) scale(0);
        transform-origin: bottom;
        transition: transform 0.1s;
      }

      .slider:hover .slider__value-container,
      .slider:active .slider__value-container {
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
        transform: translate(-50%, calc(-50% - 0.5em));
        font-size: 1em;
        text-align: center;
        background-color: rgb(var(--primary));
        color: rgb(var(--on-primary));
      }
    `
  }

  render() {
    return html`
      <style>
        :host {
          --primary: ${theme.primary};
          --surface: ${theme.surface};
          --on-primary: ${theme.onPrimary};
          --on-surface: ${theme.onSurface};
        }
      </style>
      <span class=${classMap({ label: true })}>${this.label}</span>
      <div tabindex="0" id="slider" class=${classMap({ slider: true })}>
        <div class=${classMap({ slider__track: true })}>
          <div
            class=${classMap({ slider__bar: true })}
            style=${styleMap({ transform: `scaleX(${this.scale(this.maxValue, this.min, this.max, 0, 1)})` })}
          ></div>
          <div
            class=${classMap({ 'slider__thumb-container': true })}
            style=${styleMap({ left: `${this.scale(this.maxValue, this.min, this.max, 0, 100)}%` })}
          >
            <div class=${classMap({ 'slider__focus-ring': true })}></div>
            <div class=${classMap({ slider__thumb: true })}></div>
            <div class=${classMap({ 'slider__value-container': true })}>
              <div class=${classMap({ 'slider__value-arrow': true })}></div>
              <div class=${classMap({ 'slider__value-text': true })}>${this.maxValue}</div>
            </div>
          </div>
        </div>
      </div>
    `
  }

  firstUpdated(changedProperties) {
    this.setupEventListeners()
  }

  scale(number, inMin, inMax, outMin, outMax) {
    return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
  }

  setupEventListeners() {
    const that = this
    const sliderElem = that.shadowRoot.getElementById('slider')

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
        this.dispatchEvent(new Event('change'))
      }
    }

    const handleTouchStart = event => {
      console.log(event)
      sliderElem.addEventListener('touchmove', handleMove)
      sliderElem.addEventListener('touchend', handleTouchEnd)
      handleMove(event)
    }

    const handleTouchEnd = event => {
      sliderElem.removeEventListener('touchmove', handleMove)
      sliderElem.removeEventListener('touchend', handleTouchEnd)
      this.dispatchEvent(new Event('change'))
    }

    const handleMove = event => {
      const elemRect = sliderElem.getBoundingClientRect()
      const pos = getPos(event, elemRect)
      if (pos <= 16) {
        that.maxValue = that.min
      } else if (pos >= elemRect.width - 16) {
        that.maxValue = that.max
      } else {
        const newValue = that.scale((pos - 16) / (elemRect.width - 32), 0, 1, that.min, that.max)
        that.maxValue = parseFloat((newValue - (newValue % that.step)).toPrecision(12))
      }
    }

    const getPos = (event, elemRect) => {
      return (
        (event.type == 'touchmove' || event.type == 'touchstart' ? event.targetTouches[0].pageX : event.pageX) -
        elemRect.left +
        (window.pageXOffset || document.documentElement.scrollLeft)
      )
    }

    sliderElem.addEventListener('mousedown', handleMouseDown)
    sliderElem.addEventListener('touchstart', handleTouchStart)
  }
}

customElements.define('that-slider', ThatSlider)
