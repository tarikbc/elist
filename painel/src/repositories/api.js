import axios from 'axios'

const URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8080/v1'
  : 'https://api.back.com/v1'

const login = (login, password) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${URL}/auth/account`, { login, password })
      .then(response => {
        if (response.status === 200) {
          resolve(response.data.token)
        } else {
          reject(response.data.error)
        }
      })
      .catch(err => reject(err))
  })
}

export default {
  login,
  axios: axios.create({
    baseURL: URL,
    timeout: 15000
  })
}
