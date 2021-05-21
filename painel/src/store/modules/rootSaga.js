import { all } from 'redux-saga/effects'

import user from './user/sagas'
import store from './store/sagas'
import main from './main/sagas'
import day from './day/sagas'



export default function* rootSaga() {
  return yield all([user, store, main, day])
}
