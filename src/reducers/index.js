export const guiTreeApp = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_CONTROLLER':
      return {
        ...state,
        [action.key]: {...action.controllerSettings}
      }
    default:
      return state
  }
}