import { createStore } from 'redux'
import { addController } from './actions'
import { guiTreeApp } from './reducers'

class GuiTree {
  constructor() {
    this.controllerObjects = {}
    this.store = createStore(guiTreeApp)
    this.store.subscribe(() => this.updateObjects())
  }
  
  add(parentKey, object) {
    for (let key in object) {
      if (!key.startsWith("_")) {
        let newController = { parentKey }
        if (typeof object[key] === "object") {
          this.add(key, object[key])
          newController.value = object[key]._value
        } else {
          newController.value = object[key]
        }
        if (object["_" + key] != undefined) {
          newController = {
            ...newController,
            ...object["_" + key]
          }
        }
        this.store.dispatch(addController(key, newController))
      }
    }
  }

  updateObjects() {
    const state = this.store.getState()
    // for (let controller in state.controllers) {
    //   this.controllerObjects[controller] = state.controllers[controller]
    // }
    console.log(state)
    // console.log(this)
  }
}

window.settings = {
  variableOne: 1,
  variableTwo: {
    _value: 2,
    variableThree: 3
  },
  variableFour: 10,
  _variableFour: {
    min: 0,
    max: 100,
    step: 2
  },
  variableFive: 9000
}

const gui = new GuiTree()
gui.add("settings", settings)