import { all, call, put, takeLatest } from 'redux-saga/effects'
import api from '../../../repositories/api'
import { requestFailed } from '../error/action'
import { dayReportSuccess, dayListSuccess, daySuccess } from './actions'


export function* dayRequest({ payload }) {
  try {
    const { dayId, token } = payload
    const response = yield call(api.axios.get, `/day/${dayId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    const dayData = response.data.sellers.reduce((acc, curr) => {
      acc.success += curr.success
      acc.fail += curr.fail
      return acc
    }, { success: 0, fail: 0 })

    const data = {
      ...dayData,
      sellers: response.data.sellers,
      conversion: ((dayData.success / (dayData.success + dayData.fail)) * 100).toFixed(2),
    }

    yield put(daySuccess(data))
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

export function* dayReportRequest({ payload }) {
  try {
    const { storeId, token, period } = payload

    const response = yield call(api.axios.get, `day/store/${storeId}/report?from=${period.from}&to=${period.to}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    yield put(dayReportSuccess(response.data))

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

export function* dayListRequest({ payload }) {
  try {
    const { storeId, token, page, limit } = payload
    const response = yield call(api.axios.get, `/day/store/${storeId}`, {
      params: {
        page,
        limit,
        sort: '-date'
      },
      headers: { Authorization: `Bearer ${token}` }
    })

    yield put(dayListSuccess(response.data))
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
  takeLatest('@day/REPORT_REQUEST', dayReportRequest),
  takeLatest('@day/LIST_REQUEST', dayListRequest),
  takeLatest('@day/REQUEST', dayRequest),
])
