import React, { useState, useRef } from 'react'

import RetweetForm from './components/RetweetForm'
import ParentTweet from './components/ParentTweet'

import api from '../../api/tweets'

export default function ({ tweet, tweets, setTweets, noParent }) {

	const likeBtn = useRef(null)
	const [retweeting, setRetweeting] = useState(false)

	function handleClick() {
		likeBtn.current.disabled = true
		api.toogleLike(tweet.id)
			.then(wasLiked => {
				const newLikes = wasLiked ? tweet.likes + 1 : tweet.likes - 1
				const newTweets = tweets.map(pub => {
					if (pub.id === tweet.id) {
						return { ...pub, likes: newLikes }
					} else if (pub.parent && pub.parent.id === tweet.id) {
						return { ...pub, parent: { ...pub.parent, likes: newLikes } }
					}
					return pub
				})
				setTweets(newTweets)
			})
			.catch(() => {
				alert('An error has occured')
			})
			.finally(() => {
				likeBtn.current.disabled = false
			})
	}

	function handleRetweet() {
		setRetweeting(true)
	}

	return (
		<>
			{retweeting && <RetweetForm tweet={tweet} hideForm={() => setRetweeting(false)} tweets={tweets} setTweets={setTweets} />}
			{tweet.is_retweet && !noParent && (
				<ParentTweet tweet={tweet.parent} tweets={tweets} setTweets={setTweets} />
			)}
			<div className="mb-3">
				<p>{tweet.content}</p>
				<div className="d-flex flex-row w-100">
					<button className="btn btn-primary" ref={likeBtn} onClick={handleClick}> {tweet.likes} Likes</button>
					<button className="btn btn-outline-primary ml-2" onClick={handleRetweet}>{tweet.retweets} Retweets</button>
					<p className="small text-muted align-self-center mb-0 ml-5">Por {tweet.user.username}</p>
				</div>
			</div>
		</>
	)
}