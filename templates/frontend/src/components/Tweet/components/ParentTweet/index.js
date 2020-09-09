import React from 'react'

import Tweet from '../..'

export default function ParentTweet({ tweet, updateTweets }) {
  return (
    <>
      <small className="text-muted align-self-end"><span>&#11138;</span> Retweet</small>
      <div className="mb-3 pl-5 border-bottom">
        <Tweet tweet={tweet} noParents isParent updateTweets={updateTweets} />
      </div>
    </>
  )
}