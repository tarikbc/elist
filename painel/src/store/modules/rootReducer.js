import { combineReducers } from 'redux'

import user from './user/reducer'
import error from './error/reducer'
import store from './store/reducer'
import main from './main/reducer'
import day from './day/reducer'



export default combineReducers({
  user,
  error,
  store,
  main,
  day
})
