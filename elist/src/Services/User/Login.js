import api from '~/Services'

export default async ({token}) => new Promise((resolve, reject) => {
  if (!token) {
    reject('Erro ao fazer login.')
  }
  api.post(`/v1/auth/account`, { token }).then(response => {
    if(response?.data){
      resolve(response.data)
    }else{
      reject(0)
    }
  }).catch(err => {
    reject(err.data?.error?.code || 0)
  })
})
