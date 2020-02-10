import './components'

export class ThatGui {
  constructor(options) {
    this.container = document.createElement('that-gui')
    if (options.parent) {
      this.container.hasParent = true
      document.getElementById(options.parent).append(this.container)
    } else {
      document.body.append(this.container)
    }
    this.controllerElements = {}
    this.objects = {}
    this.theme = {
      primary: '265deg, 100%, 47%',
      primaryVariant: '258deg, 100%, 35%',
      secondary: '174deg, 97%, 43%',
      secondaryVariant: '180deg, 99%, 27%',
      background: '0deg, 0%, 100%',
      surface: '0deg, 0%, 100%',
      error: '349deg, 100%, 35%',
      onPrimary: '0deg, 0%, 100%',
      onSecondary: '0deg, 0%, 0%',
      onBackground: '0deg, 0%, 0%',
      onSurface: '0deg, 0%, 0%',
      onError: '0deg, 0%, 100%',
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
