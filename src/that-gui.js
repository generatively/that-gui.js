import './components'
import { componentFactory } from './component-factory'

export class ThatGui {
  constructor(options = { width: 500, parent: '', theme: {}, componentFactory: {} }) {
    this.container = document.createElement('that-gui')
    if (options.parent) {
      this.container.hasParent = true
      document.getElementById(options.parent).append(this.container)
    } else {
      document.body.append(this.container)
      this.container.width = options.width
    }
    this.componentFactory = { ...componentFactory, ...options.componentFactory }
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
    this.controllerElements = {}
    this.objects = {}
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
      if (this.controllerElements[pathKey]) this.controllerElements[pathKey].append(controllerElement)
      pathKey = `${pathKey}.${key}`
    } else {
      this.container.append(controllerElement)
      pathKey = key
    }

    this.controllerElements[pathKey] = controllerElement

    properties = {
      label: key,
      ...parentObject.__all,
      ...parentObject[`_${key}`],
      object: parentObject,
      path: pathKey,
      key: key,
    }

    if (typeof object == 'object') {
      let type = 'object'
      if (properties.type == undefined) {
        if (Array.isArray(object)) {
          if (object.length > 0) {
            type = typeof object[0]
            for (const item of object) {
              if (type != typeof item) {
                type = 'object'
                break
              }
            }
          } else {
            type = 'object'
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
      } else if (properties.switch) {
        const keys = Object.keys(object).filter(key => key.charAt(0) != '_')
        properties.options = keys
        properties.value = keys[0]

        for (const childKey in object) {
          if (childKey.startsWith('_')) continue
          const childObject = object[childKey]
          for (const grandChildKey in childObject) {
            const elem = this.addController(grandChildKey, childObject, `${pathKey}.${childKey}`)
            if (elem) controllerElement.appendChild(elem).slot = childKey
          }
        }
      } else if (type == 'color') {
        properties.value = { ...object }
      } else {
        properties.value = [...object]
        if (!properties.type) properties.type = type
      }
    } else {
      properties.value = object
    }

    if (!properties.type)
      properties.type =
        properties.value == undefined
          ? 'title'
          : String(properties.value).charAt(0) == '#'
          ? 'color'
          : typeof properties.value

    for (const prop in properties) controllerElement[prop] = properties[prop]

    controllerElement.component = this.componentFactory[properties.type.split(' ')[0]](properties, controllerElement)

    return controllerElement
  }

  remove(startPointPath) {
    const pathArray = startPointPath.split('.')
    for (const key in this.controllerElements) {
      const keyArray = key.split('.')
      if (pathArray.every(i => keyArray.includes(i))) {
        Array.isArray(this.controllerElements[key].component)
          ? this.controllerElements[key].component.forEach(elem => elem.remove())
          : this.controllerElements[key].component.remove()
        delete this.controllerElements[key].component
        this.controllerElements[key].remove()
        delete this.controllerElements[key]
      }
    }
  }

  clear() {
    Object.keys(this.objects).forEach(key => this.remove(key))
  }

  refresh(startPointKey = '') {
    if (startPointKey) {
      const topControllerIndex = Array.prototype.indexOf.call(
        this.controllerElements[startPointKey].parentElement.children,
        this.controllerElements[startPointKey],
      )

      this.remove(startPointKey)

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
    } else {
      Object.keys(this.objects).forEach(key => this.refresh(key))
    }
  }
}
