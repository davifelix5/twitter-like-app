import index from '../cookies/getCookie'

export default {
  BASE_URL: 'http://127.0.0.1:8000/api/',
  postHeaders: {
    'Content-Type': 'application/json',
    'X-CSRFToken': index('csrf')
  }
}