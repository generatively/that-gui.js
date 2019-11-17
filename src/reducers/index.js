export const guiTreeApp = (state = {}, action) => {
  let newState = {...state}
  
  switch (action.type) {
    case 'ADD_CONTROLLER':
      if (newState.controllers === undefined) {
        newState.controllers = {}
      }
      newState.controllers[action.key] = {...action.controllerSettings}
      return newState

    case 'REMOVE_CONTROLLER':
      delete newState.controllers[action.key]
      return newState

    case 'UPDATE_CONTROLLER':
      newState.controllers[action.key] = {...newState.controllers[action.key], ...action.controllerSettings}
      return newState

    default:
      return state
  }
}