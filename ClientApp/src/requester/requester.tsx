import axios from 'axios'
import configurations from './config'
// import { language } from '../Languages'
// import { requestTimeout, maximumRetry } from '../Utils/constants.util'

const { environment } = configurations





const requester = async (account: { token: any}, service: { method: any; endpoint: any; source: any; isPartner: any; dynamic: any; timeout: any }, options:any={ data:{}, header:{} }) => {
  const { method, endpoint, source } = service
  const { data = {}, header = {} } = options
  const url = environment + endpoint

  const headers = { Authorization: account.token, ...header }

  const config = {
    method,
    url,
    headers,
    data,
    validateStatus: (status: number) => (status >= 200 && status < 300),

  }

  console.log(config)

  return axios
    .request(config)
    .then(({ data: response,headers }) => {
      return [null, response,headers]
    })
    .catch(error => {
      return[error,null]
    })
}

export default requester
