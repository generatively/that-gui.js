import { createStore } from 'redux'
import { addController } from './actions'
import { guiTreeApp } from './reducers'

const settings = {
  epic: 5,
  __epic: {
    title: "Epic",
    min: 0,
    max: 100,
    step: 1
  }
};

const store = createStore(guiTreeApp)

console.log(store.getState())

const unsubscribe = store.subscribe(() => console.log(store.getState()))

store.dispatch(addController("epic", settings.__epic))

unsubscribe()