import {
  buildAsyncState,
  buildAsyncActions,
  buildAsyncReducers,
} from '@thecodingmachine/redux-toolkit-wrapper'
import { navigateAndSimpleReset } from '~/Navigators/Root'
import AsyncStorage from '@react-native-community/async-storage'
import jwt from 'jwt-decode'

export default {
  initialState: buildAsyncState(),
  action: buildAsyncActions('startup/init', async (args, { dispatch }) => {
    
    const tokenStorage = await AsyncStorage.getItem('@elist:token')
    const selectedStore = await AsyncStorage.getItem('@elist:selectedStore')

    if (tokenStorage) {
      const decoded = jwt(tokenStorage)
      if (decoded.stores?.length > 0) {
        const userRole = decoded.stores.find(store => store.storeId._id === (selectedStore ? selectedStore : decoded.stores[0].storeId._id))
        if (userRole && ['manager', 'owner', 'cashier'].includes(userRole.type)) {
          dispatch(authSuccess(tokenStorage))
          dispatch(storeRequest(token, storeId, true))
        }else{
          dispatch(signOut())
        }
      } else {
        alert('Usuário não está associado à loja alguma')
        dispatch(signOut())
      }
    }else{
      dispatch(signOut())
    }

    navigateAndSimpleReset('Main')
  }),
  reducers: buildAsyncReducers({ itemKey: null }), // We do not want to modify some item by default
}
