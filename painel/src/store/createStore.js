import { createStore, compose, applyMiddleware } from 'redux'
import Reactotron from 'reactotron-react-js'

export default (reducers, middlewares) => {
  const enhancer =
    process.env.NODE_ENV === 'development'
      ? compose(Reactotron.createEnhancer, applyMiddleware(...middlewares))
      : applyMiddleware(...middlewares)

  return createStore(reducers, enhancer)
}
