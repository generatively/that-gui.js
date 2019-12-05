export const setup = (mainStyle) => {
  return {type: 'SETUP', mainStyle}
}

export const addController = (key, controllerSettings) => {
  return {type: 'ADD_CONTROLLER', key, controllerSettings}
}

export const removeController = key => {
  return {type: 'REMOVE_CONTROLLER', key}
}

export const updateController = (key, controllerSettings) => {
  return {type: 'UPDATE_CONTROLLER', key, controllerSettings}
}