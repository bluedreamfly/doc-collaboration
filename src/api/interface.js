import axios from 'axios'
import qs from 'qs'
import config from 'config/api'

const BASE_URL = `${config.BASE_URL}/interface`

export default {
  addInterface(data) {
    return axios.post(`${BASE_URL}`, qs.stringify(data))
  },
  updateInterface(data) {
    return axios.put(`${BASE_URL}`, qs.stringify(data))
  }
}