export function dayReportRequest(storeId, token, period) {
  return {
    type: '@day/REPORT_REQUEST',
    payload: { storeId, token, period }
  }
}

export function dayReportSuccess(data) {
  return {
    type: '@day/REPORT_SUCCESS',
    payload: { data }
  }
}

export function dayListRequest(storeId, token, page = 1, limit = 10) {
  return {
    type: '@day/LIST_REQUEST',
    payload: { storeId, token, page, limit }
  }
}

export function dayListSuccess(dataRequest) {
  return {
    type: '@day/LIST_SUCCESS',
    payload: { dataRequest }
  }
}

export function dayRequest(dayId, token) {
  return {
    type: '@day/REQUEST',
    payload: { dayId, token }
  }
}

export function daySuccess(dataRequest) {
  return {
    type: '@day/SUCCESS',
    payload: { dataRequest }
  }
}