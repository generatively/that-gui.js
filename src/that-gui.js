import './components'

class ThatGui {
  constructor(options) {
    this.prefixCharacter = options.prefixCharacter || '_'
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
    if (!key.startsWith(this.prefixCharacter)) {
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
          if (!childKey.startsWith(this.prefixCharacter)) {
            this.addController(childKey, object, pathKey)
          }
        }
        if (object[this.prefixCharacter + 'value'] != undefined) {
          value = object[this.prefixCharacter + 'value']
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

      if (parentObject[this.prefixCharacter + key] != undefined) {
        for (const prop in parentObject[this.prefixCharacter + key]) {
          controllerElement[prop] = parentObject[this.prefixCharacter + key][prop]
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
    _value: 120,
    zzz: { x: { y: { b: 1 } } },
    varA: [1, 6, 8],
    varLol: () => {
      console.log('lol')
    },
    varB: {
      _value: () => {
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
      _value: 5,
      varF: 18,
    },
  }
  const secondObject = {
    _value: 120,
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
    anotherVar: 'this is really neat right?',
  }

  window.gui = new ThatGui({
    parentID: 'settings',
  })
  gui.add({ settings })
  gui.add({ secondObject })
  gui.add({ thirdObject })
}
