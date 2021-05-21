export function userRequest(userId, token) {
  return {
    type: '@user/REQUEST',
    payload: { userId, token }
  }
}

export function userSuccess(dataRequest) {
  return {
    type: '@user/SUCCESS',
    payload: { dataRequest }
  }
}

export function userFailed(dataRequest) {
  return {
    type: '@user/FAILED',
    payload: { dataRequest }
  }
}

export function userListRequest(storeId, token, page = 1, limit = 10) {
  return {
    type: '@user/LIST_REQUEST',
    payload: { storeId, token, page, limit }
  }
}

export function userListSuccess(dataRequest) {
  return {
    type: '@user/LIST_SUCCESS',
    payload: { dataRequest }
  }
}

export function userAddRequest(userData, token) {
  return {
    type: '@user/ADD_REQUEST',
    payload: { userData, token }
  }
}

export function userAddSuccess(dataRequest) {
  return {
    type: '@user/ADD_SUCCESS',
    payload: { dataRequest }
  }
}

export function logout() {
  return {
    type: '@user/LOGOUT'
  }
}

export function userEditRequest(userData, token, userId) {
  return {
    type: '@user/EDIT_REQUEST',
    payload: { userData, token, userId }
  }
}

export function userChangePasswordOpenModal() {
  return {
    type: '@user/CHANGE_PASSWORD_OPEN_MODAL',
  }
}

export function userChangePasswordCloseModal() {
  return {
    type: '@user/CHANGE_PASSWORD_CLOSE_MODAL',
  }
}

export function userChangePasswordRequest(userPasswords, token, userId) {
  return {
    type: '@user/CHANGE_PASSWORD_REQUEST',
    payload: { userPasswords, token, userId }
  }
}

export function userChangePasswordSuccess(dataRequest) {
  return {
    type: '@user/CHANGE_PASSWORD_SUCCESS',
    payload: { dataRequest }
  }
}

export function userEditSuccess(data, userId) {
  return {
    type: '@user/EDIT_SUCCESS',
    payload: { data, userId }
  }
}

export function unLinkUser(storeId, userId, token) {
  return {
    type: '@user/UNLINK',
    payload: { storeId, userId, token }
  }
}

export function setUserToGoal(data, token) {
  return {
    type: '@user/SET_GOAL',
    payload: { data, token }
  }
}

export function userLinkRequest(data, userId, token) {
  return {
    type: '@user/LINK_REQUEST',
    payload: { data, userId, token }
  }
}

export function userLinkSuccess(data) {
  return {
    type: '@user/LINK_SUCCESS',
    payload: { data }
  }
}

export function userUnlinkSuccess(userId) {
  return {
    type: '@user/UNLINK_SUCCESS',
    payload: { userId }
  }
}

export function userUpdateLink(data, userId, token, storeId) {
  return {
    type: '@user/UPDATE_LINK',
    payload: { data, userId, token, storeId }
  }
}

export function userAvatarUpdateRequest(dataRequest, userId, token) {
  return {
    type: '@user/AVATAR_UPDATE_REQUEST',
    payload: { dataRequest, userId, token }
  }
}

export function userAvatarUpdateSuccess(url) {
  return {
    type: '@user/AVATAR_UPDATE_SUCCESS',
    payload: { url }
  }
}

export function userExistsRequest(cpf, token) {
  return {
    type: '@user/EXISTS_REQUEST',
    payload: { cpf, token }
  }
}

export function userExistsSuccess(data) {
  return {
    type: '@user/EXISTS_SUCCESS',
    payload: { data }
  }
}

export function userExistsFailed(dataRequest) {
  return {
    type: '@user/USER_EXISTS_FAILED',
    payload: { dataRequest }
  }
}

export function userAddModal(data) {
  return {
    type: '@user/ADD_MODAL',
    payload: { data }
  }
}

export function clearNewUser() {
  return {
    type: '@user/CLEAR_NEW_USER',
  }
}