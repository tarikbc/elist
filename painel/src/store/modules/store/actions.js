export function storeListRequest(token, userId) {
  return {
    type: '@store/LIST_REQUEST',
    payload: { token, userId }
  }
}

export function storeListSuccess(dataRequest) {
  return {
    type: '@store/LIST_SUCCESS',
    payload: { dataRequest }
  }
}

export function storeRequest(storeId, token) {
  return {
    type: '@store/REQUEST',
    payload: { storeId, token }
  }
}

export function storeSuccess(dataRequest) {
  return {
    type: '@store/SUCCESS',
    payload: { dataRequest }
  }
}

export function storeUpdateRequest(storeId, data, token) {
  return {
    type: '@store/UPDATE_REQUEST',
    payload: { storeId, data, token }
  }
}

export function storeUpdateSuccess(dataRequest) {
  return {
    type: '@store/UPDATE_SUCCESS',
    payload: { dataRequest }
  }
}

export function storeAvatarUpdateRequest(dataRequest, storeId, token) {
  return {
    type: '@store/AVATAR_UPDATE_REQUEST',
    payload: { dataRequest, storeId, token }
  }
}

export function storeAvatarUpdateSuccess(url) {
  return {
    type: '@store/AVATAR_UPDATE_SUCCESS',
    payload: { url }
  }
}
