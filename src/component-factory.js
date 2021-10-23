const componentFactory = {
  title(properties) {
    const elem = document.createElement('span')
    elem.innerText =
      properties.value != undefined && typeof properties.value != 'object' ? properties.value : properties.label
    return elem
  },
  number(properties, controllerElement) {
    const elem = document.createElement('that-slider')
    elem.min = properties.min || 0
    elem.max =
      properties.max || (properties.value > 1 ? Math.pow(10, properties.value.toString().split('.')[0].length) : 1)
    elem.step = properties.step || (properties.value > 1 ? 1 : 0.001)
    elem.maxValue = properties.value || 1
    elem.label = properties.label
    elem.updateContinuously = properties.updateContinuously || false
    elem.hideValueTextField = properties.hideValueTextField || false
    if (properties.hasChildren == undefined) {
      elem.addEventListener('change', (event) => {
        properties.object[properties.key] = event.target.maxValue
      })
    } else {
      elem.addEventListener('change', (event) => {
        properties.object[properties.key].__value = event.target.maxValue
      })
    }
    elem.style.width = 'initial'

    controllerElement.actions = {
      reset: () => {
        elem.maxValue = properties.value
        elem.dispatchEvent(new Event('change'))
      },
      randomise: () => {
        elem.maxValue = Math.random() * (elem.max + Math.abs(elem.min)) + elem.min
        elem.dispatchEvent(new Event('change'))
      },
      ...controllerElement.actions,
    }

    return elem
  },
  range(properties, controllerElement) {
    const elem = document.createElement('that-slider')
    elem.min = properties.min || 0
    elem.max =
      properties.max || (properties.value > 1 ? Math.pow(10, properties.value.toString().split('.')[0].length) : 1)
    elem.step = properties.step || (properties.value > 1 ? 1 : 0.001)
    elem.minValue = properties.value[0]
    elem.maxValue = properties.value[1]
    elem.label = properties.label
    elem.addEventListener('change', (event) => {
      properties.object[properties.key][0] = event.target.minValue
      properties.object[properties.key][1] = event.target.maxValue
    })
    elem.style.width = 'initial'

    controllerElement.actions = {
      reset: () => {
        elem.minValue = properties.value[0]
        elem.maxValue = properties.value[1]
        elem.dispatchEvent(new Event('change'))
      },
      randomise: () => {
        elem.minValue = Math.random() * (elem.max + Math.abs(elem.min)) + elem.min
        elem.maxValue = Math.random() * (elem.max + Math.abs(elem.min)) + elem.min
        elem.dispatchEvent(new Event('change'))
      },
      ...controllerElement.actions,
    }

    return elem
  },
  string(properties, controllerElement) {
    const elem = document.createElement('that-input')
    elem.value = properties.value
    elem.label = properties.label
    elem.min = properties.min
    elem.max = properties.max
    elem.step = properties.step
    elem.addEventListener('change', (event) => {
      properties.object[properties.key] = event.target.value
    })
    elem.style.width = '100%'

    controllerElement.actions = { reset: () => (elem.value = properties.value), ...controllerElement.actions }
    if (typeof properties.value == 'number' && !controllerElement.actions.randomise)
      controllerElement.actions.randomise = () => {
        elem.value = Math.ceil(Math.random() * 1000000000000000)
        elem.dispatchEvent(new Event('change'))
      }

    return elem
  },
  //temp - need to write a custom component for this
  textArea(properties, controllerElement) {
    const elem = document.createElement('textarea')
    const labelElem = document.createElement('span')

    elem.value = properties.value
    elem.addEventListener('change', (event) => {
      properties.object[properties.key] = event.target.value
    })
    elem.style.width = '100%'
    elem.style.borderRadius = '0.25em'
    elem.style.resize = 'vertical'

    labelElem.innerText = properties.label

    controllerElement.actions = { reset: () => (elem.value = properties.value), ...controllerElement.actions }

    return [labelElem, elem]
  },
  boolean(properties, controllerElement) {
    const elem = document.createElement('that-checkbox')
    elem.value = properties.value
    elem.label = properties.label

    if (properties.hasChildren == undefined) {
      elem.addEventListener('change', (event) => {
        properties.object[properties.key] = event.target.value
      })
    } else {
      elem.addEventListener('change', (event) => {
        properties.object[properties.key].__value = event.target.value
      })
    }

    elem.style.float = 'left'

    controllerElement.actions = {
      reset: () => (elem.value = properties.value),
      randomise: () => (elem.value = Math.random() < 0.5),
      ...controllerElement.actions,
    }

    return elem
  },
  function(properties) {
    const elem = document.createElement('that-button')
    elem.icon = this.icon
    elem.type = properties.type.split(' ').slice(1)
    elem.innerText = properties.label
    elem.addEventListener('click', properties.value)
    return elem
  },
  menu(properties, controllerElement) {
    const elem = document.createElement('that-menu')
    elem.value = properties.value
    elem.options = properties.options
    elem.label = properties.label
    elem.addEventListener('change', (event) => {
      properties.object[properties.key] = event.target.value
    })
    elem.style.width = '100%'

    controllerElement.actions = {
      reset: () => (elem.value = properties.value),
      randomise: () => (elem.value = elem.options[Math.floor(Math.random() * elem.options.length)]),
      ...controllerElement.actions,
    }

    return elem
  },
  tabs(properties, controllerElement) {
    const elem = document.createElement('that-tabbar')
    elem.value = properties.value
    elem.options = properties.options
    elem.label = properties.label
    elem.addEventListener('change', (event) => {
      if (properties.switch) {
        properties.object[properties.key].__value = event.target.value
      } else {
        properties.object[properties.key] = event.target.value
      }
    })

    if (!properties.switch) {
      controllerElement.actions = {
        reset: () => (elem.value = properties.value),
        randomise: () => (elem.value = elem.options[Math.floor(Math.random() * elem.options.length)]),
        ...controllerElement.actions,
      }
    }

    return elem
  },
  color(properties, controllerElement) {
    const elem = document.createElement('that-color-picker')
    elem.value = properties.value
    if (properties.options) elem.swatches = properties.options
    elem.label = properties.label
    elem.addEventListener('change', (event) => {
      properties.object[properties.key] = event.target.value
    })

    controllerElement.actions = {
      reset: () => (elem.value = properties.value),
      randomise: () => {
        elem.h = Math.random()
        elem.s = Math.random()
        elem.l = Math.random()
        elem.a = elem.noAlpha ? 1 : Math.round(Math.random() * 1000) / 1000
      },
      ...controllerElement.actions,
    }

    return elem
  },
  gradient(properties, controllerElement) {
    const elem = document.createElement('span')
    elem.innerText = 'REQUIRES IMPLEMENTATION'

    controllerElement.actions = { reset: () => (elem.value = properties.value), ...controllerElement.actions }

    return elem
  },
}

componentFactory.input = componentFactory.string

export { componentFactory }
