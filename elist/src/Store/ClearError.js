import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

export default name => ({
  initialState: buildAsyncState(),
  action: buildAsyncActions(`${name}/clearError`, (args, { getState }) => {
    throw null
  }),
  reducers: buildAsyncReducers({
    errorKey: 'error',
  })
})
