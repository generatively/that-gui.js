import { createStore } from 'redux'
import { guiTreeApp } from './reducers'

export const store = createStore(guiTreeApp)