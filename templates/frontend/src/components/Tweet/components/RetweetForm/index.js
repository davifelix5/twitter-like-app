import React from 'react'

import { useForm } from '../../../../hooks/formHooks'

import api from '../../../../api/tweets'

import './styles.css'

export default function RetweetForm({ tweet, hideForm }) {

  const [values, handleChange] = useForm({
    content: '',
  })

  function handleRetweet(e) {
    e.preventDefault()
    api.retweet(tweet.id, values)
      .then(() => {
        alert('Retweeted successfuly')
      })
      .catch(err => {
        if (err.status === 401) return alert('Você deve estar logado!')
        alert(err.message)
      })
  }

  function handleHideForm() {
    hideForm()
  }

  return (
    <div className="form-modal-container">
      <div className="form-modal border rounded d-flex flex-column justify-content-center">
        <div className="parent-info border-bottom mb-3">
          <p className="mb-1">{tweet.content}</p>
          <span className="small text-muted mr-2">{tweet.likes} likes</span>
          <span className="small text-muted mr-2">{tweet.retweets} retweets</span>
          <span className="small text-muted">Por {tweet.user.username}</span>
        </div>
        <form onSubmit={handleRetweet} className="d-flex flex-column">
          <textarea placeholder="Digite seu comentário" name="content" type="text" value={values.content} onChange={handleChange} className="form-control mb-2 retweet-area" />
          <button type="submit" className="btn btn-primary align-self-end">Tweet</button>
        </form>
        <button className="close-btn" onClick={handleHideForm}>
          <span role="img" aria-label="Close">&#x274C;</span>
        </button>
      </div>
    </div>
  )
}
