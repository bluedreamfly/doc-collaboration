import axios from 'axios'
import qs from 'qs'
import config from 'config/api'

const BASE_URL = `${config.BASE_URL}/project`

export default {
  fetchProjects() {
    return axios.get(BASE_URL);
  },
  addProject(data) {
    return axios.post(BASE_URL, qs.stringify(data))
  },
  getProjectMenu(projectId) {
    return axios.get(`${BASE_URL}/menu?projectId=${projectId}`)
  }
  // getProjectDirectory(data) {
  //   return axios.get(`BASE_URL/directory`, qs.stringify(data))
  // } 
}






