import produce from 'immer'

const INITIAL_STATE = {
  error: null
}

export default function error(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@error/REQUEST_FAILED': {
        draft.error = action.dataRequest
        draft.loading = false
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
