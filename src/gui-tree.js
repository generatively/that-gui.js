import { addController, removeController, updateController } from './actions'
import { store } from './store'
import './components/gui-container'
import './components/gui-controller'

class GuiTree {
  constructor(options) {
    this.store = store
    this.prefixCharacter = options.prefixCharacter || "_"
    this.pathCharacter = options.pathCharacter || "."
    this.element = document.createElement("gui-container")
    if (options.parentID) {
      document.getElementById(options.parentID).appendChild(this.element)
    }
    this.controllerElements = {}
    this.objects = {}
    this.unsubscribe = store.subscribe(() => this.updateObjects())
  }

  add(objects) {
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
    this.unsubscribe()

    const topControllerIndex = Array.prototype.indexOf.call(this.controllerElements[startPointKey].parentNode.children, this.controllerElements[startPointKey])
    for (let key of Object.keys(store.getState().controllers).reverse()) {
      if (key.includes(startPointKey)) { 
        store.dispatch(removeController(key))
        this.controllerElements[key].parentNode.removeChild(this.controllerElements[key])
        delete this.controllerElements[key]
      }
    }

    const path = startPointKey.split(this.pathCharacter)
    const key = path.pop()
    const pathKey = path.join(this.pathCharacter)

    let controllersObject = this.objects
    path.forEach(dir => {controllersObject = controllersObject[dir]})
    
    this.addController(key, controllersObject, pathKey)
    this.controllerElements[pathKey].insertBefore(this.controllerElements[pathKey].lastChild, this.controllerElements[pathKey].children[topControllerIndex])
  }

  updateObjects() {
    const state = store.getState()

    for (let pathKey in state.controllers) {
      const path = pathKey.split(this.pathCharacter)
      let { value, ...controllerOptions } = state.controllers[pathKey]
      let object = this.objects
      for (let i = 0; i < path.length - 1; i++) {
        object = object[path[i]]
      }
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

      elem.setAttribute("key", key)
      elem.setAttribute("path", pathKey)

      for (let key in controllerOptions) {
        elem.setAttribute(key, controllerOptions[key])
      }

      if (Object.keys(controllerOptions).length > 0) {
        object[this.prefixCharacter + key] = controllerOptions
      }
    }
  }
}

window.settings = {
  varA: [1,6,8],
  varB: {
    _value: 10000,
    varC: 5000,
    aaa: 1,
    az: 12,
    _az: {
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
  varG: 1,
  _varG: {
    label: "Variable G",
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

window.onload = () => {
  window.gui = new GuiTree({
    parentID: "settings"
  })
  gui.add({settings})
  gui.add({secondObject})
  gui.add({thirdObject})
  
  store.dispatch(updateController("settings.varB", {value: 20000}))

  console.log(store.getState())
  console.log(gui.objects)
}