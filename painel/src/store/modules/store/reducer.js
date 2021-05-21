import produce from 'immer'

const INITIAL_STATE = {
  storeList: null,
  store: null,
  loading: false,
  metadata: {
    pagination: {
      totalCount: -1
    }
  }
}

export default function store(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@store/LIST_SUCCESS': {
        draft.storeList = action.payload.dataRequest.items
        draft.metadata = action.payload.dataRequest.metadata
        break
      }
      case '@store/SUCCESS': {
        draft.store = action.payload.dataRequest
        break
      }
      case '@store/UPDATE_REQUEST': {
        draft.loading = true
        break
      }
      case '@store/UPDATE_SUCCESS': {
        draft.store = action.payload.dataRequest
        draft.loading = false
        break
      }
      case '@store/AVATAR_UPDATE_REQUEST': {
        draft.loading = true
        break
      }
      case '@store/AVATAR_UPDATE_SUCCESS': {
        draft.store.photo.url = action.payload.url
        draft.loading = false
        break
      }
      case '@error/REQUEST_FAILED': {
        draft.loading = false
        break
      }
      case '@integration/SUCCESS': {
        draft.store.integration = action.payload.dataRequest
        break
      }
      case '@integration/DISCONNECT_SUCCESS': {
        draft.store.integration = {}
        break
      }
      case '@user/LOGOUT': {
        return INITIAL_STATE
      }
      case '@main/CLEAR_REDUX': {
        return INITIAL_STATE
      }
      default:
        return state
    }
  })
}
