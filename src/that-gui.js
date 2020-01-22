import './components'

export class ThatGui {
  constructor(options) {
    this.container = document.createElement('that-gui')
    if (options.parentID) {
      document.getElementById(options.parentID).append(this.container)
    } else {
      document.body.append(this.container)
    }
    this.controllerElements = {}
    this.objects = {}
    this.theme = {
      primary: '98, 0, 238',
      primaryVariant: '55, 0, 179',
      secondary: '3, 218, 198',
      secondaryVariant: '1, 135, 134',
      background: '255, 255, 255',
      surface: '255, 255, 255',
      error: '176, 0, 32',
      onPrimary: '255, 255, 255',
      onSecondary: '0, 0, 0',
      onBackground: '0, 0, 0',
      onSurface: '0, 0, 0',
      onError: '255, 255, 255',
      ...options.theme,
    }
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

      controllerElement.gui = this

      if (pathKey != undefined) {
        this.controllerElements[pathKey].appendChild(controllerElement)
        pathKey = pathKey + '.' + key
      } else {
        this.container.appendChild(controllerElement)
        pathKey = key
      }

      this.controllerElements[pathKey] = controllerElement

      if (Array.isArray(object)) {
        value = [...object]
      } else if (typeof object === 'object') {
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
        controllerElement.value = value
        controllerElement.type = typeof value
      } else {
        controllerElement.type = 'title'
      }

      controllerElement.object = parentObject
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

  updateAllControllers() {
    for (let elem in this.controllerElements)
      this.controllerElements[elem].requestUpdate()
  }
}
