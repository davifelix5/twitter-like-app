import React from 'react'

import Tweet from '../../components/Tweet'
import Loader from '../../components/Loader'
import PostTweetForm from '../../components/PostTweetForm'


export default function TweetsList({ tweets, setTweets, form }) {
  const hasForm = form === undefined ? true : form
  return (
    <div className="container">
      {tweets.length ? (
        <>
          {hasForm && (
            <div className="row mb-4">
              <PostTweetForm tweets={tweets} setTweets={setTweets} />
            </div>
          )}
          <ul className="row list-group" style={{ listStyle: 'none' }}>
            {tweets.map(tweet => {
              return (
                <li className="col-12 col-md-10 mx-auto border rounded py-3 mb-4" key={tweet.id}>
                  <Tweet tweet={tweet} tweets={tweets} setTweets={setTweets} />
                </li>
              )
            })}
          </ul>
        </>
      ) : (
          <div className="d-flex justify-content-center">
            <Loader />
          </div>
        )
      }
    </div>
  )
}