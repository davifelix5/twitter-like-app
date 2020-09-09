import React, { useState, useEffect, useContext } from 'react'

import { AuthContext } from '../../App'

import Navbar from '../../components/Navbar'
import Tweet from '../../components/Tweet'
import TweetsList from '../../components/TweetsList'
import Loader from '../../components/Loader'

import api from '../../api/tweets'
import { updateTweetList } from '../../helpers/updateTweets'

export default function Profile() {
  const [tweets, setTweets] = useState([])
  const [tweetsNotFound, setTweetsNotFound] = useState(false)
  const auth = useContext(AuthContext)

  useEffect(() => {
    api.profileList(auth.username)
      .then(tweets => {
        setTweets(tweets)
      })
      .catch(() => {
        setTweetsNotFound(true)
      })
  }, [auth.username])

  function updateTweets(tweetId, newTweet) {
    const newTweets = updateTweetList(tweets, tweetId, newTweet)
    setTweets(newTweets)
  }

  return (
    <>
      <Navbar />
      <div className="container">
        {tweets.length ? (
          <>
            <div className="row justify-content-center">
              <h1>Bem vindo(a)!</h1>
            </div>
            <div className="row mb-3">
              <h3>Your tweets:</h3>
            </div>
            <TweetsList>
              {tweets.map(tweet => <Tweet tweet={tweet} updateTweets={updateTweets} key={tweet.id} />)}
            </TweetsList>
          </>
        ) : (
            <div className="row w-100 d-flex justify-content-center">
              {tweetsNotFound ? <h1>Nenhum tweet encontrado</h1> : <Loader />}
            </div>
          )}
          )

      </div>
    </>
  )
}
