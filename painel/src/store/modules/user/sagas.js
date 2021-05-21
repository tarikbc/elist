import { call, put, all, takeLatest } from 'redux-saga/effects'
import { toast } from 'react-toastify'
import api from '../../../repositories/api'

import {
  userSuccess,
  userListSuccess,
  userAddSuccess,
  userEditSuccess,
  userUnlinkSuccess,
  userChangePasswordSuccess,
  userAvatarUpdateSuccess,
  userExistsSuccess,
  userLinkSuccess,
  userExistsFailed
} from './actions'
import { requestFailed } from '../error/action'

export function* getUser({ payload }) {
  try {
    const { userId, token } = payload
    const response = yield call(api.axios.get, `/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    yield put(userSuccess(response.data))
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

export function* userList({ payload }) {
  try {
    const { storeId, token, page, limit } = payload
    const response = yield call(api.axios.get, `/user/store/${storeId}`, {
      params: {
        page,
        limit
      },
      headers: { Authorization: `Bearer ${token}` }
    })
    yield put(userListSuccess(response.data))
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

export function* userAdd({ payload }) {
  try {
    const { userData, token } = payload
    const response = yield call(api.axios.post, '/user', userData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    yield put(userAddSuccess(response.data))
    toast.success('Usuario adicionado com sucesso')
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

export function* userEdit({ payload }) {
  try {
    const { userData, token, userId } = payload
    const response = yield call(api.axios.put, `/user/${userId}`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    toast.success('Usuário atualizado com sucesso.')
    yield put(userEditSuccess(response.data, userId))
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

export function* userUnLink({ payload }) {
  try {
    const { storeId, userId, token } = payload
    // yield put(RepositoriesActions.send())
    yield call(api.axios.post, `/user/${userId}/unlinkStore`, { storeId }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    yield put(userUnlinkSuccess(userId))

    toast.success('Usuário removido com sucesso.')
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

export function* userLink({ payload }) {
  try {
    const { data, userId, token } = payload
    const response = yield call(api.axios.post, `/user/${userId}/linkStore`, data, {
      headers: { Authorization: `Bearer ${token}` }
    })

    yield put(userLinkSuccess(response.data))
    toast.success('Usuário vinculado com sucesso')
  } catch (e) {
    if (e.response && e.response.status >= 500) {
      yield put(
        requestFailed({
          error: {
            friendlyMsg: e.response.data?.error?.friendlyMsg || 'Servidor fora do ar.'
          }
        })
      )
    } else if (e.response.status == 401) {
      yield put(
        userExistsFailed({
          error: {
            friendlyMsg: 'O usuário já vinculado a loja'
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

export function* userChangePassword({ payload }) {
  try {
    const { userPasswords, token, userId } = payload
    const response = yield call(api.axios.post, `/user/${userId}/change_password`, userPasswords, {
      headers: { Authorization: `Bearer ${token}` }
    })
    toast.success('Senha alterada com sucesso.')
    yield put(userChangePasswordSuccess(response.data))
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

export function* userExists({ payload }) {
  try {
    const { cpf, token } = payload
    const response = yield call(api.axios.get, `/user/cpf/${cpf}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    yield put(userExistsSuccess(response.data))
  } catch (e) {
    if (e.response && e.response.status >= 500) {
      yield put(
        requestFailed({
          error: {
            friendlyMsg: e.response.data?.error?.friendlyMsg || 'Servidor fora do ar.'
          }
        })
      )
    } else if (e.response.status == 400) {
      yield put(
        userExistsFailed({
          error: {
            friendlyMsg: 'O CPF informado é inválido'
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
  /* Usuário */
  takeLatest('@user/REQUEST', getUser),
  takeLatest('@user/LIST_REQUEST', userList),
  takeLatest('@user/ADD_REQUEST', userAdd),
  takeLatest('@user/EDIT_REQUEST', userEdit),
  takeLatest('@user/CHANGE_PASSWORD_REQUEST', userChangePassword),
  takeLatest('@user/EXISTS_REQUEST', userExists),
])

