import produce from 'immer'

const INITIAL_STATE = {

}

export default function store (state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      default:
        return state
    }
  })
}
