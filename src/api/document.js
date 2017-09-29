import axios from 'axios'
import qs from 'qs'
import config from 'config/api'

const BASE_URL = `${config.BASE_URL}/document`

export default {
  addDocument(data) {
    return axios.post(BASE_URL, qs.stringify(data))
  },
  delDocument(docId) {
    return axios.delete(`${BASE_URL}/${docId}`)
  },
  updateDocument(data) {
    return axios.put(BASE_URL, qs.stringify(data))
  }
}