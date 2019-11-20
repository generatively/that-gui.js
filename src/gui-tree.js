import { addController, removeController, updateController, setup } from './actions'
import { store } from './store'
import './components/gui-container'
import './components/gui-controller'

class GuiTree {
  constructor(options) {
    this.store = store
    this.unsubscribe = store.subscribe(() => this.updateObjects())
    this.prefixCharacter = options.prefixCharacter || "_"
    this.pathCharacter = options.pathCharacter || "."
    this.element = document.createElement("gui-container")
    if (options.parentID) {
      document.getElementById(options.parentID).appendChild(this.element)
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
      const controllerElement = document.createElement("gui-controller")
      let newController = {}

      if (pathKey != undefined) {
        this.controllerElements[pathKey].appendChild(controllerElement)
        pathKey = pathKey + this.pathCharacter + key
      } else {
        this.element.appendChild(controllerElement)
        pathKey = key
      }

      this.controllerElements[pathKey] = controllerElement

      const object = parentObject[key]

      if (Array.isArray(object)) {
        newController.value = [...object]
      } else if (typeof object === "object") {
        for (let childKey in object) {
          if (!childKey.startsWith(this.prefixCharacter)) {
            this.addController(childKey, object, pathKey)
          }
        }
        if (object[this.prefixCharacter + "value"]) {
          newController.value = object[this.prefixCharacter + "value"]
        }
      } else {
        newController.value = object
      }

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
      for (let i = 0; i < path.length - 1; i++) {
        object = object[path[i]]
      }
      let { value, label, ...controllerOptions } = controllers[pathKey]
      const key = path[path.length - 1]
      const elem = this.controllerElements[pathKey]

      if (value || object[key][this.prefixCharacter + "value"]) {
        if (Array.isArray(object[key])) {
          object[key] = [...value]
        } else if (typeof object[key] === "object") {
          object[key][this.prefixCharacter + "value"] = value
        } else {
          object[key] = value
        }
        elem.setAttribute("value", value)
      }

      elem.setAttribute("label", label || key)
      elem.path = pathKey

      for (let key in controllerOptions) {
        elem.setAttribute(key, controllerOptions[key])
      }

      if (Object.keys(controllerOptions).length > 0) {
        object[this.prefixCharacter + key] = {label, ...controllerOptions}
      }
    }
  }
}

window.onload = () => {
  const settings = {
    _value: 120,
    zzz: {x:{y:{b: 1}}},
    varA: [1,6,8],
    varB: {
      _value: 10000,
      varC: 5000,
      aaa: 1,
      az: 12,
      _az: {
        label: "hello",
        max: 100
      }
    },
    varD: 10,
    _varD: {
      min: 0,
      max: 100,
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
      varI: -1
    },
    _varH: {
      label: "okay dog"
    }
  }
  const thirdObject = {
    anotherVar: "this is really neat right?"
  }

  window.gui = new GuiTree({
    parentID: "settings"
  })
  gui.add({settings})
  gui.add({secondObject})
  gui.add({thirdObject})
  
  store.dispatch(updateController("settings.varB", {value: 20000}))
}