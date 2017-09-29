import axios from 'axios'
import qs from 'qs'
import config from 'config/api'

const BASE_URL = `${config.BASE_URL}/directory`

export default {
  getDirectorys(data) {
    return axios.get(BASE_URL, qs.stringify(data))
  },
  addDirectory(data) {
    return axios.post(BASE_URL, qs.stringify(data))
  },
  delDirectory(dirId) {
    return axios.delete(`${BASE_URL}/${dirId}`)
  },
  updateDirectory(data) {
    return axios.put(`${BASE_URL}`, qs.stringify(data))
  }
}
