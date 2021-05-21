import produce from 'immer'

const INITIAL_STATE = {
  loading: false,
  dayServices: null,
  totalSales: null,
  totalServices: null,
  conversion: null,
  sellers: [],
  days: [],
  day: null,
  metadata: {
    pagination: {
      currentPage: 1,
      pageCount: 1,
      totalCount: -1,
      limit: 10
    }
  },
}

export default function store(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@day/REPORT_REQUEST': {
        draft.loading = true
        break
      }
      case '@day/REPORT_SUCCESS': {
        draft.loading = false
        draft.totalSales = action.payload.data.success
        draft.dayServices = action.payload.data.avg
        draft.totalServices = action.payload.data.fail + action.payload.data.success
        draft.conversion = ((action.payload.data.success / (action.payload.data.fail + action.payload.data.success) > 0 ? action.payload.data.success / (action.payload.data.fail + action.payload.data.success) : 0) * 100).toFixed(2)
        draft.sellers = action.payload.data.sellers
        break
      }
      case '@day/LIST_REQUEST': {
        draft.loading = true
        break
      }
      case '@day/LIST_SUCCESS': {
        draft.days = action.payload.dataRequest.items
        draft.metadata = action.payload.dataRequest.metadata
        draft.loading = false
        break
      }
      case '@day/REQUEST': {
        draft.loading = true
        break
      }
      case '@day/SUCCESS': {
        draft.day = action.payload.dataRequest
        draft.loading = false
        break
      }
      case '@error/REQUEST_FAILED': {
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
