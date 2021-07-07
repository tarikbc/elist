import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'
import LoginService from '~/Services/User/Login'
import AsyncStorage from '@react-native-community/async-storage'
import { loadToken } from '~/Services'
import { navigate } from '~/Navigators/Root'


export default {
  initialState: buildAsyncState(),
  action: buildAsyncActions('user/loggedUser', async (args, { getState, dispatch}) => {
    if (!args?.token) {
      throw 'Erro ao fazer login'
    }
    //Autentica com o back
    const response = await LoginService(args)

    //Salva token
    await AsyncStorage.setItem('@elist:authToken', response.token)
    //Define token p/ todas as requisições da api
    await loadToken()

    //Verifica se tem info pendente no user
    if (!response.user.username || !response.user.name || !response.user.password){
      navigate('CompleteProfile')
    }else{
      await dispatch(Connect.action())
      dispatch(Alert.action(['info', i18n.t('general.success'), i18n.t('user.login')]))
    }

    dispatch(Load.action(response.user))

    return null
  }),
  reducers: buildAsyncReducers({
    errorKey: 'error',
    loadingKey: 'loading',
    itemKey: null
  })
}
