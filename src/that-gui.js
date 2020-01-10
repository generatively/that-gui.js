import './components'
import reset from './images/reset.svg'

class ThatGui {
  constructor(options) {
    this.element = document.createElement('that-container')
    if (options.parentID) {
      document.getElementById(options.parentID).append(this.element)
    } else {
      document.body.append(this.element)
    }
    this.controllerElements = {}
    this.objects = {}
  }

  add(objects) {
    for (let key in objects) {
      this.objects[key] = objects[key]
      this.addController(key, objects)
    }
  }

  addController(key, parentObject, pathKey) {
    if (!key.startsWith('_')) {
      let value
      const object = parentObject[key]
      const controllerElement = document.createElement('that-controller')

      if (pathKey != undefined) {
        this.controllerElements[pathKey].appendChild(controllerElement)
        pathKey = pathKey + '.' + key
      } else {
        this.element.appendChild(controllerElement)
        pathKey = key
      }

      this.controllerElements[pathKey] = controllerElement

      // if (Array.isArray(object)) {
      //   value = [...object]
      // } else
      if (typeof object === 'object') {
        for (let childKey in object) {
          if (!childKey.startsWith('_')) {
            this.addController(childKey, object, pathKey)
          }
        }
        if (object['__value'] != undefined) {
          value = object['__value']
        }
      } else {
        value = object
      }

      if (value != undefined) {
        controllerElement.initialValue = value
        controllerElement.value = value
        controllerElement.type = typeof value
      } else {
        controllerElement.type = 'title'
      }

      controllerElement.parentObject = parentObject
      controllerElement.path = pathKey
      controllerElement.key = key
      controllerElement.label = key

      if (parentObject.__all != undefined) {
        for (const prop in parentObject.__all) {
          controllerElement[prop] = parentObject.__all[prop]
        }
      }

      if (parentObject['_' + key] != undefined) {
        for (const prop in parentObject['_' + key]) {
          controllerElement[prop] = parentObject['_' + key][prop]
        }
      }
    }
  }

  // refreshControllers(startPointKey) {
  //   if (startPointKey.length > 0) {
  //     const topControllerIndex = Array.prototype.indexOf.call(this.controllerElements[startPointKey].parentNode.children, this.controllerElements[startPointKey])
  //     for (let key in store.getState().controllerReducer.controllers) {
  //       if (key.includes(startPointKey)) {
  //         store.dispatch(removeController(key))
  //         this.controllerElements[key].parentNode.removeChild(this.controllerElements[key])
  //         delete this.controllerElements[key]
  //       }
  //     }

  //     const path = startPointKey.split(".")
  //     const key = path.pop()
  //     let pathKey, parentNode
  //     if (path.length > 0) {
  //       pathKey = path.join(".")
  //       parentNode = this.controllerElements[pathKey]
  //     } else {
  //       parentNode = this.element
  //     }

  //     let controllersObject = this.objects
  //     path.forEach(dir => {controllersObject = controllersObject[dir]})

  //     this.addController(key, controllersObject, pathKey)
  //     parentNode.insertBefore(parentNode.lastChild, parentNode.children[topControllerIndex])
  //   }
  // }
}

window.onload = () => {
  const settings = {
    __value: 20,
    number: {
      small: 0.5,
      larger: 4263,
      limitted: -128.989999,
      _limitted: {
        min: -256,
        max: 512,
        step: 0.000001,
      },
      range: [0.5, 23],
      _range: {
        min: 0,
        max: 100,
        step: 0.02
      },
      array: [0, 0.5, 1, 10, 100, 1000],
      _array: {
        minimise: true,
      },
    },
    string: {
      string: 'hello world',
      array: ['resistance', 'is', 'futile'],
      _array: {
        minimise: true,
      },
    },
    boolean: {
      checked: true,
      unchecked: false,
      switchOn: true,
      switchOff: false,
      array: [true, true, false, true, true, false, false, true],
      _array: { minimise: true },
    },
    multiChoice: {
      dropdown: 'Chino',
      _dropdown: { options: ['The', 'Chino', 'Short'] },
      dropdownArray: ['The', 'they', 'they'],
      _dropdownArray: {
        options: [
          ['The', 'Chino', 'Short'],
          ['are', 'they', 'good'],
          ['or', "aren't", 'they'],
        ],
      },
      tabs: 'The',
      _tabs: { options: ['The', 'Chino', 'Short'] },
      radiobuttons: 'Short',
      _radiobuttons: { options: ['The', 'Chino', 'Short'] },
      __all: { minimise: true },
    },
    color: {
      hex: '#FFFFFF',
      rgb: [255, 0, 1],
      hsl: [255, 0, 100],
      newLimits: [0.2, 0.6, 0.1],
      _newLimits: {
        min: 0,
        max: 1,
        step: 0.1,
      },
      swatch: '#0f0f0f',
      _swatch: {
        options: ['#123456', '#aef30c', '#235192'],
      },
      colorFromGradient: '#aef30c',
      _colorFromGradient: {
        options: ['#123456', '#aef30c', '#235192'],
      },
      gradient: [['#123456', 0], ['#aef30c', 0.3], '#283ace', ['#235192', 1]],
    },
    custom: {
      0: 0
      //support custom ones in here
    },
    __all: { minimise: true },
  }
  const secondObject = {
    __value: 120,
    zzz: {
      x: { y: { b: 1, c: 20 } },
      c: { y: { b: 1, z: 5 } },
    },
    varG: 1,
    _varG: {
      label: 'Variable G',
      controllerType: 'range',
      step: 0.01,
    },
    varH: {
      varI: { x: { y: { b: 1 } } },
    },
    _varH: {
      label: 'okay dog',
    },
  }
  const thirdObject = {
    __value: 'hello',
    zzz: {
      x: { y: { b: 1, c: 20 } },
      c: { y: { b: 1, z: 5 } },
    },
    varA: [1, 6, 8],
    varLol: () => {
      console.log('lol')
    },
    _varLol: {
      label: 'BUTTON',
      type: 'function',
    },
    varHi: () => {
      console.log('hi')
    },
    _varHi: {
      type: 'function outline !fill !elevate',
      icon: reset,
    },
    bbb: () => {
      console.log('bbb')
    },
    _bbb: {
      type: 'function !fill !elevate',
    },
    varB: {
      __value: () => {
        console.log('b')
      },
      varC: 5000,
      aaa: false,
      bbb: true,
      az: 12,
      _az: {
        label: 'hello',
        max: 100,
        color: '#FF00FF',
      },
    },
    varD: 10,
    _varD: {
      min: 0,
      max: 10,
      step: 2,
    },
    varE: {
      __value: 5,
      varF: 18,
    },
  }

  window.gui = new ThatGui({
    parentID: 'settings',
  })
  gui.add({ settings })
  gui.add({ secondObject, thirdObject })
}
