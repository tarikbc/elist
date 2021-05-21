import produce from 'immer'

const INITIAL_STATE = {
  user: {
    name: {
      first: '...',
      last: '...',
      complete: '...'
    },
    type: 'user',
    stores: []
  },
  loading: false,
  searchLoading: false,
  error: null,
  newUser: {
    success: false,
    type: null,
    userId: null
  },
  userList: [],
  passwordModal: false,
  addUserModal: false,
  userExists: {
    found: false
  },
  metadata: {
    pagination: {
      currentPage: 1,
      pageCount: 1,
      totalCount: -1,
      limit: 10
    }
  }
}

export default function user(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@user/REQUEST': {
        draft.loading = true
        break
      }
      case '@user/SUCCESS': {
        draft.user = action.payload.dataRequest
        draft.loading = false
        break
      }
      case '@user/FAILED': {
        draft.error = action.payload.dataRequest
        draft.loading = false
        break
      }
      case '@user/LIST_REQUEST': {
        draft.loading = true
        break
      }
      case '@user/LIST_SUCCESS': {
        draft.userList = action.payload.dataRequest.items
        draft.metadata = action.payload.dataRequest.metadata
        draft.loading = false
        break
      }
      case '@user/ADD_REQUEST': {
        draft.loading = true
        draft.newUser.type = action.payload.userData.storeType
        break
      }
      case '@user/EDIT_REQUEST': {
        draft.loading = true
        break
      }
      case '@user/CHANGE_PASSWORD_REQUEST': {
        draft.loading = true
        break
      }
      case '@user/CHANGE_PASSWORD_SUCCESS': {
        draft.passwordModal = false
        draft.loading = false
        break
      }
      case '@user/CHANGE_PASSWORD_OPEN_MODAL': {
        draft.passwordModal = true
        break
      }
      case '@user/CHANGE_PASSWORD_CLOSE_MODAL': {
        draft.passwordModal = false
        break
      }
      case '@user/EDIT_SUCCESS': {
        const userIndex = draft.userList.findIndex(u => u._id === action.payload.userId)
        if (userIndex >= 0) {
          draft.userList[userIndex] = { stores: draft.userList[userIndex].stores, isOnThisMonthGoal: draft.userList[userIndex].isOnThisMonthGoal, ...action.payload.data }
        } else if (draft.user._id == action.payload.data._id) {
          draft.user = { stores: draft.user.stores, isOnThisMonthGoal: draft.user.isOnThisMonthGoal, ...action.payload.data}
        }
        draft.loading = false
        break
      }
      case '@user/UNLINK_SUCCESS': {
        draft.userList = draft.userList.filter(u => u._id !== action.payload.userId)
        break
      }
      case '@user/ADD_SUCCESS': {
        draft.userList = [action.payload.dataRequest, ...draft.userList]
        draft.addUserModal = false
        draft.loading = false
        draft.error = null
        draft.newUser.success = true
        break
      }
      case '@user/LOGOUT': {
        return INITIAL_STATE
      }
      case '@user/AVATAR_UPDATE_REQUEST': {
        draft.loading = true
        break
      }
      case '@user/AVATAR_UPDATE_SUCCESS': {
        draft.user.photo.url = action.payload.url
        draft.loading = false
        break
      }
      case '@user/EXISTS_REQUEST': {
        draft.searchLoading = true
        break
      }
      case '@user/EXISTS_SUCCESS': {
        draft.userExists = action.payload.data
        draft.searchLoading = false
        draft.error = null
        break
      }
      case '@user/USER_EXISTS_FAILED': {
        draft.searchLoading = false
        draft.loading = false
        draft.error = action.payload.dataRequest
        break
      }
      case '@user/LINK_REQUEST': {
        draft.loading = null
        draft.newUser.type = action.payload.data.type
        break
      }
      case '@user/LINK_SUCCESS': {
        draft.userList = [action.payload.data, ...draft.userList]
        draft.loading = false
        draft.addUserModal = false
        draft.error = null
        draft.newUser.success = true
        draft.newUser.userId = action.payload.data._id
        break
      }
      case '@user/CLEAR_NEW_USER': {
        draft.newUser = {
          success: false,
          type: null
        }
      }
      case '@error/REQUEST_FAILED': {
        draft.loading = false
        draft.searchLoading = false
        draft.error = action.dataRequest
        break
      }
      case '@user/ADD_MODAL': {
        draft.addUserModal = action.payload.data
        draft.error = null
        break
      }
      case '@main/CLEAR_REDUX': {
        draft.userList = null
        draft.metadata = {
          pagination: {
            currentPage: 1,
            pageCount: 1,
            totalCount: -1,
            limit: 10
          }
        }
        break
      }
      default:
        return state
    }
  })
}
