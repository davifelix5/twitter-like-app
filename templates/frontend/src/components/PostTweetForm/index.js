import React from 'react'

import { useForm } from '../../hooks/formHooks'

import api from '../../api/tweets'

export default function PostTweetForm({ tweets, setTweets }) {

  const [values, handleChange, clear] = useForm({
    content: ''
  })

  function handleSubmit(e) {
    e.preventDefault()
    api.post(values)
      .then(res => {
        console.log('**PostTweetForm.handleSubmit.then(): ', res)
        alert('Tweeted successfully!')
        clear()
      })
      .catch(() => {
        alert('Could not tweet!')
      })
  }

  return (
    <form onSubmit={handleSubmit} className="col-12 col-md-10 d-flex flex-column mx-auto">
      <div className="form-group">
        <textarea required style={{ height: 120 }} placeholder="Escreva seu tweet" name="content" value={values.content} onChange={handleChange} className="form-control" />
      </div>
      <button type="submit" className="btn btn-primary border-rounded align-self-end">Tweet</button>
    </form>
  )
}
