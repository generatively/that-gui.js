import { combineReducers } from 'redux'

export const controllerReducer = (state = {}, action) => {
  let newState = {...state}
  
  switch (action.type) {
    case 'SETUP':
      if (newState.controllers === undefined) {
        newState.controllers = {}
      }
      if (newState.lastAction === undefined) {
        newState.lastAction = {}
      }
      break

    case 'ADD_CONTROLLER':
      newState.controllers[action.key] = {...action.controllerSettings}
      break

    case 'REMOVE_CONTROLLER':
      delete newState.controllers[action.key]
      break

    case 'UPDATE_CONTROLLER':
      newState.controllers[action.key] = {...newState.controllers[action.key], ...action.controllerSettings}
      break
  }

  return newState
}

export const lastAction = (state = {}, action) => {
  return action;
}

export const rootReducer = combineReducers({
  controllerReducer,
  lastAction
})

