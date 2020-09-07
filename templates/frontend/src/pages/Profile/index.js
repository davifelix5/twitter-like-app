import React, { useState, useEffect, useContext } from 'react'

import { AuthContext } from '../../App'

import Navbar from '../../components/Navbar'
import TweetsList from '../../components/TweetsList'

import api from '../../api/tweets'

export default function Profile() {
  const [tweets, setTweets] = useState([])
  const [tweetsNotFound, setTweetsNotFound] = useState(false)
  const auth = useContext(AuthContext)

  useEffect(() => {
    api.profileList(auth.username)
      .then(tweets => {
        if (tweets) setTweets(tweets)
      })
      .catch(err => {
        setTweetsNotFound(true)
      })
  }, [])

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <h1>Bem vindo(a)!</h1>
        </div>
        <div className="row mb-3">
          <h3>Your tweets:</h3>
        </div>
        {tweetsNotFound ? <h1>Não foi possível encontrar nenhum tweet</h1> : (
          <TweetsList tweets={tweets} setTweets={setTweets} form={false} />
        )}
      </div>
    </>
  )
}
