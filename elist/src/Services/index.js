import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import { Config } from '~/Config'

const instance = axios.create({
  baseURL: Config.API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 3000,
})

instance.interceptors.response.use(
  (response) => response,
  ({ message, response: { data, status } }) => {
    return Promise.reject({ message, data, status })
  },
)

export const loadToken = async () => {
  try {
    const token = await AsyncStorage.getItem('@elist:authToken')
    instance.defaults.headers.common['Authorization'] = token ? 'Bearer ' + token : null
  } catch (err) {
    console.log('Erro token', err)
  }
}

loadToken()

export default instance
