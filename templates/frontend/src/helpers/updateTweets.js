export function updateTweetList(tweetList, tweetId, newTweet) {
  const existingTweet = tweetList.find(item => item.id === tweetId)
  if (!existingTweet) {
    // Means that there was a retweet
    return updateTweetList([newTweet, ...tweetList], newTweet.parent.id, {
      ...newTweet.parent
    })
  }

  const newTweetList = tweetList.map(tweet => {
    if (tweet.id === tweetId) {
      return newTweet
    } else if (tweet.parent && tweet.parent.id === tweetId) {
      return { ...tweet, parent: newTweet }
    }
    return tweet
  })
  return newTweetList
}

export function updateSingleTweet(tweet, tweetId, newTweet) {
  const updatedTweet = tweet.id === tweetId ? newTweet : { ...tweet, parent: newTweet }
  return updatedTweet
}