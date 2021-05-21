import { all, call, put, takeLatest } from 'redux-saga/effects'
import api from '../../../repositories/api'

import { storeListSuccess, storeSuccess, storeUpdateSuccess, storeAvatarUpdateSuccess } from './actions'
import { requestFailed } from '../error/action'

import { toast } from 'react-toastify'

export function* storeList({ payload }) {
  try {
    const { token, userId } = payload
    const response = yield call(api.axios.get, 'store/user/' + userId, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        limit: 10,
        page: 1
      }
    })
    yield put(storeListSuccess(response.data))
    // toast.info('Relatório carregado com sucesso!');
  } catch (e) {
    if (e.response && e.response.status >= 500) {
      yield put(
        requestFailed({
          error: {
            friendlyMsg: e.response.data?.error?.friendlyMsg || 'Servidor fora do ar.'
          }
        })
      )
    } else {
      if (e.code === 'ECONNABORTED') {
        yield put(
          requestFailed({
            error: {
              friendlyMsg: 'Internet instável, não foi possível conectar.'
            }
          })
        )
      } else {
        yield put(
          requestFailed(
            e.response && e.response.data
              ? e.response.data
              : {
                error: {
                  friendlyMsg: 'Alguma coisa deu errado...',
                  err: e
                }
              }
          )
        )
      }
    }
  }
}

export function* getStore({ payload }) {
  try {
    const { storeId, token } = payload
    const response = yield call(api.axios.get, `/store/${storeId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    yield put(storeSuccess(response.data))
  } catch (e) {
    if (e.response && e.response.status >= 500) {
      yield put(
        requestFailed({
          error: {
            friendlyMsg: e.response.data?.error?.friendlyMsg || 'Servidor fora do ar.'
          }
        })
      )
    } else {
      if (e.code === 'ECONNABORTED') {
        yield put(
          requestFailed({
            error: {
              friendlyMsg: 'Internet instável, não foi possível conectar.'
            }
          })
        )
      } else {
        yield put(
          requestFailed(
            e.response && e.response.data
              ? e.response.data
              : {
                error: {
                  friendlyMsg: 'Alguma coisa deu errado...',
                  err: e
                }
              }
          )
        )
      }
    }
  }
}

export function* storeUpdate({ payload }) {
  try {
    const { data, token, storeId } = payload
    // yield put(RepositoriesActions.send())
    const response = yield call(api.axios.put, `/store/${storeId}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    })

    toast.success('Loja atualizada com sucesso.')
    yield put(storeUpdateSuccess(response.data))
  } catch (e) {
    if (e.response && e.response.status >= 500) {
      yield put(
        requestFailed({
          error: {
            friendlyMsg: e.response.data?.error?.friendlyMsg || 'Servidor fora do ar.'
          }
        })
      )
    } else {
      if (e.code === 'ECONNABORTED') {
        yield put(
          requestFailed({
            error: {
              friendlyMsg: 'Internet instável, não foi possível conectar.'
            }
          })
        )
      } else {
        yield put(
          requestFailed(
            e.response && e.response.data
              ? e.response.data
              : {
                error: {
                  friendlyMsg: 'Alguma coisa deu errado...',
                  err: e
                }
              }
          )
        )
      }
    }
  }
}

export function* storeAvatarUpdate({ payload }) {
  try {
    const { dataRequest, token, storeId } = payload
    const response = yield call(api.axios.post, `/store/${storeId}/upload`, dataRequest, {
      headers: { Authorization: `Bearer ${token}` }
    })

    toast.success('Avatar atualizado com sucesso.')
    yield put(storeAvatarUpdateSuccess(response.data.url))
  } catch (e) {
    if (e.response && e.response.status >= 500) {
      yield put(
        requestFailed({
          error: {
            friendlyMsg: e.response.data?.error?.friendlyMsg || 'Servidor fora do ar.'
          }
        })
      )
    } else {
      if (e.code === 'ECONNABORTED') {
        yield put(
          requestFailed({
            error: {
              friendlyMsg: 'Internet instável, não foi possível conectar.'
            }
          })
        )
      } else {
        yield put(
          requestFailed(
            e.response && e.response.data
              ? e.response.data
              : {
                error: {
                  friendlyMsg: 'Alguma coisa deu errado...',
                  err: e
                }
              }
          )
        )
      }
    }
  }
}

export default all([
  takeLatest('@store/LIST_REQUEST', storeList),
  takeLatest('@store/REQUEST', getStore),
  takeLatest('@store/UPDATE_REQUEST', storeUpdate),
  takeLatest('@store/AVATAR_UPDATE_REQUEST', storeAvatarUpdate),

])
