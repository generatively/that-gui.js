export const addController = (key, controllerSettings) => {
  return {type: 'ADD_CONTROLLER', key, controllerSettings}
}