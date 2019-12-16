import { addController, removeController, updateController, setup } from './actions'
import { store } from './store'
import './components'

class ThatGui {
  constructor(options) {
    this.store = store
    this.unsubscribe = store.subscribe(() => this.updateObjects())
    this.prefixCharacter = options.prefixCharacter || "_"
    this.pathCharacter = options.pathCharacter || "."
    this.element = document.createElement("that-container")
    if (options.parentID) {
      document.getElementById(options.parentID).append(this.element)
    } else {
      document.body.append(this.element)
    }
    this.controllerElements = {}
    this.objects = {}
  }

  add(objects) {
    store.dispatch(setup())
    for (let key in objects) {
      this.objects[key] = objects[key]
      this.addController(key, objects)
    }
  }
  
  addController(key, parentObject, pathKey) {
    if (!key.startsWith(this.prefixCharacter)) {
      const object = parentObject[key]
      const controllerElement = document.createElement("that-controller")

      if (pathKey != undefined) {
        this.controllerElements[pathKey].appendChild(controllerElement)
        pathKey = pathKey + this.pathCharacter + key
      } else {
        this.element.appendChild(controllerElement)
        pathKey = key
      }

      controllerElement.path = pathKey
      controllerElement.label = object.label || key

      this.controllerElements[pathKey] = controllerElement

      let newController = {}

      let value

      if (Array.isArray(object)) {
        value = [...object]
      } else if (typeof object === "object") {
        for (let childKey in object) {
          if (!childKey.startsWith(this.prefixCharacter)) {
            this.addController(childKey, object, pathKey)
          }
        }
        if (object[this.prefixCharacter + "value"] != undefined) {
          value = object[this.prefixCharacter + "value"]
        }
      } else {
        value = object
      }

      controllerElement.hasValue = value != undefined

      newController.initialValue = value
      newController.value = value

      if (parentObject[this.prefixCharacter + key] != undefined) {
        newController = {
          ...newController,
          ...parentObject[this.prefixCharacter + key]
        }
      }
      
      store.dispatch(addController(pathKey, newController))
    }
  }

  refreshControllers(startPointKey) {
    if (startPointKey.length > 0) {
      const topControllerIndex = Array.prototype.indexOf.call(this.controllerElements[startPointKey].parentNode.children, this.controllerElements[startPointKey])
      for (let key in store.getState().controllerReducer.controllers) {
        if (key.includes(startPointKey)) {
          store.dispatch(removeController(key))
          this.controllerElements[key].parentNode.removeChild(this.controllerElements[key])
          delete this.controllerElements[key]
        }
      }

      const path = startPointKey.split(this.pathCharacter)
      const key = path.pop()
      let pathKey, parentNode
      if (path.length > 0) {
        pathKey = path.join(this.pathCharacter)
        parentNode = this.controllerElements[pathKey]
      } else {
        parentNode = this.element
      }

      let controllersObject = this.objects
      path.forEach(dir => {controllersObject = controllersObject[dir]})
      
      this.addController(key, controllersObject, pathKey)
      parentNode.insertBefore(parentNode.lastChild, parentNode.children[topControllerIndex])
    }
  }

  updateObjects() {
    const lastAction = store.getState().lastAction
    if (!['SETUP', 'REMOVE_CONTROLLER'].includes(lastAction.type)) {
      const controllers = store.getState().controllerReducer.controllers
      const pathKey = lastAction.key
      const path = pathKey.split(this.pathCharacter)
      let object = this.objects
      let { value, label, ...controllerOptions } = controllers[pathKey]
      const key = path[path.length - 1]

      for (let i = 0; i < path.length - 1; i++) {
        object = object[path[i]]
      }

      if (Object.keys(controllerOptions).length > 0) {
        object[this.prefixCharacter + key] = {label, ...controllerOptions}
      }

      if (value != undefined) { // || object[key][this.prefixCharacter + "value"]
        if (Array.isArray(object[key])) {
          object[key] = [...value]
        } else if (typeof object[key] === "object") {
          object[key][this.prefixCharacter + "value"] = value
        } else {
          object[key] = value
        }
      }

      this.controllerElements[pathKey].requestUpdate()
    }
  }
}

window.onload = () => {
  const settings = {
    _value: 120,
    zzz: {x:{y:{b: 1}}},
    varA: [1,6,8],
    varLol: () => {
      alert("hello")
      console.log("heyhey")
    },
    varB: {
      _value: 10000,
      varC: 5000,
      aaa: false,
      bbb: true,
      az: 12,
      _az: {
        label: "hello",
        max: 100
      }
    },
    varD: 10,
    _varD: {
      min: 0,
      max: 10,
      step: 2
    },
    varE: {
      _value: 5,
      varF: 18
    }
  }
  const secondObject = {
    _value: 120,
    varG: 1,
    _varG: {
      label: "Variable G",
      controllerType: "range",
      step: 0.01
    },
    varH: {
      varI: {x:{y:{b: 1}}}
    },
    _varH: {
      label: "okay dog"
    }
  }
  const thirdObject = {
    anotherVar: "this is really neat right?"
  }

  window.gui = new ThatGui({
    parentID: "settings"
  })
  gui.add({settings})
  gui.add({secondObject})
  gui.add({thirdObject})
  
  store.dispatch(updateController("settings.varB", {value: 25000}))
}