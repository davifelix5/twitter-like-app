import config from '../config'

const { BASE_URL, postHeaders } = config

export default {
  async index() {
    try {
      const url = 'http://127.0.0.1:8000/api/tweets/'
      const data = await fetch(url).then(response => response.json())
      return data.response
    } catch (err) {
      const error = ({ message: 'Could not find tweets', status: err.status })
      throw error
    }
  },

  async post(data) {
    const url = BASE_URL + 'tweets/create/'
    const method = 'POST'
    const body = JSON.stringify(data)
    const response = await fetch(url, { method, body, headers: postHeaders })
    if (response.status === 201) {
      return response.json()
    }
    const error = { message: 'Could not post tweet', status: response.status }
    throw error
  },

  async like(tweetId) {
    const likeUrl = `tweets/like/${tweetId}/`
    const method = 'PATCH'
    const response = await fetch(BASE_URL + likeUrl, { method, headers: postHeaders })
    if (response.status === 200) {
      return true
    }
    const error = { message: 'Could not like the tweet', status: response.status }
    throw error
  },

  async unlike(tweetId) {
    const unlikeUrl = `tweets/unlike/${tweetId}/`
    const method = 'PATCH'
    const response = await fetch(BASE_URL + unlikeUrl, { method, headers: postHeaders })
    if (response.status === 200) {
      return true
    }
    const error = { message: 'Could not unlike the tweet', status: response.status }
    throw error
  },

  async retweet(parentTweet, content) {
    const retweetUrl = `tweets/retweet/${parentTweet}/`
    const method = 'POST'
    console.log(BASE_URL + retweetUrl)
    const response = await fetch(BASE_URL + retweetUrl, {
      method,
      headers: postHeaders,
      body: JSON.stringify({
        content: content
      })
    })
    if (response.status === 201) {
      return response.json()
    }
    const error = { message: 'Could not retweet', status: response.status }
    throw error
  }
}