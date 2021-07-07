import AsyncStorage from '@react-native-community/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  buildAsyncActions, buildAsyncReducers, buildAsyncState
} from '@thecodingmachine/redux-toolkit-wrapper';
import { loadToken } from '~/Services';


export default {
  initialState: buildAsyncState(),
  action: buildAsyncActions('user/logout', async (args, { getState, dispatch }) => {
    await AsyncStorage.removeItem('@Spots:authToken')
    await loadToken()

    return null
  }),
  reducers: buildAsyncReducers({
    errorKey: 'error',
    loadingKey: 'loading',
    itemKey: 'loggedUser'
  })
}
