export const addController = (controllerSettings) => {
  return Object.assign({type: 'ADD_CONTROLLER'}, controllerSettings)
}