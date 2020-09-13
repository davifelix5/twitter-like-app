import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import Navbar from '../../components/Navbar'
import TweetsList from '../../components/TweetsList'
import Tweet from '../../components/Tweet'
import Loader from '../../components/Loader'

import api from '../../api/tweets'
import { updateSingleTweet } from '../../helpers/updateTweets'

export default function TweetDetail() {
  const { id } = useParams()

  const [tweet, setTweet] = useState(null)
  const [tweetNotFound, setTweetNotFound] = useState(false)

  function updateTweet(tweetId, newTweet) {
    const updated = updateSingleTweet(tweet, tweetId, newTweet)
    setTweet(updated)
  }

  useEffect(() => {
    api.detailView(id)
      .then(tweet => {
        setTweet(tweet)
      })
      .catch(err => {
        setTweetNotFound(true)
      })
  }, [id])

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          {!tweetNotFound && !tweet && <Loader />}
          {tweetNotFound && <h3>Tweet não encontrado</h3>}
          {tweet && (
            <TweetsList>
              <Tweet updateTweets={updateTweet} tweet={tweet} isDetail />
            </TweetsList>
          )}
        </div>
      </div>
    </>
  )
}
