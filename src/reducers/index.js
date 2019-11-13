export const guiTreeApp = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_CONTROLLER':
      const newState = {...state}
      if (newState.controllers === undefined) {
        newState.controllers = {}
      }
      newState.controllers[action.key] = {...action.controllerSettings}
      return newState
    default:
      return state
  }
}