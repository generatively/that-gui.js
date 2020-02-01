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

  updateAllControllers() {
    for (const elem in this.controllerElements) this.controllerElements[elem].requestUpdate()
  }

  add(objects) {
    for (const key in objects) {
      this.objects[key] = objects[key]
      this.addController(key, objects)
    }
  }

  addController(key, parentObject, pathKey) {
    if (key.startsWith('_')) return

    const object = parentObject[key]
    const controllerElement = document.createElement('that-controller')
    let properties

    controllerElement.gui = this

    if (pathKey != undefined) {
      if (this.controllerElements[pathKey]) this.controllerElements[pathKey].appendChild(controllerElement)
      pathKey = `${pathKey}.${key}`
    } else {
      this.container.appendChild(controllerElement)
      pathKey = key
    }

    this.controllerElements[pathKey] = controllerElement

    properties = {
      label: key,
      ...parentObject.__all,
      ...parentObject[`_${key}`],
      object: parentObject,
      path: pathKey,
      key: key
    }

    if (typeof object == 'object') {
      let type = 'object'
      if (properties.type == undefined) {
        if (Array.isArray(object)) {
          type = typeof object[0]
          for (const item of object) {
            if (type != typeof item) {
              type = 'object'
              break
            }
          }
        }
      } else {
        type = properties.type
      }

      if (type == 'object') {
        for (const childKey in object) this.addController(childKey, object, pathKey)

        if (object['__value'] != undefined) {
          properties.value = object['__value']
        }
      } else if (type == 'tabswitch') {
        const keys = Object.keys(object)
        properties.options = keys
        properties.value = keys[0]

        for (const childKey in object) {
          const childObject = object[childKey]
          for (const grandChildKey in childObject) {
            const elem = this.addController(grandChildKey, childObject, `${pathKey}.${childKey}`)
            if (elem) {
              controllerElement.append(elem)
              elem.slot = childKey
            }
          }
        }
      } else if (type == 'color') {
        properties.value = {...object}
      } else {
        properties.value = [...object]
        if (!properties.type) properties.type = `${type}Array`
      }
    } else {
      properties.value = object
    }

    if (!properties.type) properties.type = properties.value != undefined ? typeof properties.value : 'title'
    
    for (const prop in properties) controllerElement[prop] = properties[prop]

    return controllerElement
  }

  refreshControllers(startPointKey) {
    if (startPointKey.length > 0) {
      const topControllerIndex = Array.prototype.indexOf.call(
        this.controllerElements[startPointKey].parentNode.children,
        this.controllerElements[startPointKey],
      )

      for (const key in this.controllerElements) {
        if (key.includes(startPointKey)) {
          this.controllerElements[key].remove()
          delete this.controllerElements[key]
        }
      }

      const path = startPointKey.split('.')
      const key = path.pop()
      let pathKey, parentNode
      if (path.length > 0) {
        pathKey = path.join('.')
        parentNode = this.controllerElements[pathKey]
      } else {
        parentNode = this.container
      }

      let controllersObject = this.objects
      path.forEach(dir => {
        controllersObject = controllersObject[dir]
      })

      this.addController(key, controllersObject, pathKey)
      parentNode.insertBefore(parentNode.lastChild, parentNode.children[topControllerIndex])
    }
  }
}
