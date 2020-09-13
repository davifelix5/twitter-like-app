import React, { useState, useRef } from 'react'
import { useHistory } from 'react-router-dom'

import RetweetForm from './components/RetweetForm'
import ParentTweet from './components/ParentTweet'

import api from '../../api/tweets'

export default function ({ tweet, updateTweets, noParents, isDetail }) {
	const likeBtn = useRef(null)
	const [retweeting, setRetweeting] = useState(false)

	const history = useHistory()

	function handleClick() {
		likeBtn.current.disabled = true
		api.toogleLike(tweet.id)
			.then(wasLiked => {
				const newLikes = wasLiked ? tweet.likes + 1 : tweet.likes - 1
				updateTweets(tweet.id, { ...tweet, likes: newLikes })
			})
			.catch((err) => {
				alert(err.message)
			})
			.finally(() => {
				likeBtn.current.disabled = false
			})
	}

	function handleRetweet() {
		setRetweeting(true)
	}

	function handleRedirectToDetail() {
		history.push(`${tweet.id}`)
	}

	return (
		<>
			{retweeting && <RetweetForm tweet={tweet} hideForm={() => setRetweeting(false)} updateTweets={updateTweets} />}
			{tweet.is_retweet && !noParents && (
				<ParentTweet tweet={tweet.parent} updateTweets={updateTweets} />
			)}
			<div className="mb-3">
				<p>{tweet.content}</p>
				<div className="d-flex flex-row w-100">
					<button className="btn btn-primary" ref={likeBtn} onClick={handleClick}>{tweet.likes} Likes</button>
					<button className="btn btn-outline-primary ml-2" onClick={handleRetweet}>{tweet.retweets} Retweets</button>
					{!isDetail && <button className="btn btn-outline-primary ml-2" onClick={handleRedirectToDetail}>Visualizar</button>}
					<p className="small text-muted align-self-center mb-0 ml-5">Por {tweet.user.username}</p>
				</div>
			</div>
		</>
	)
}