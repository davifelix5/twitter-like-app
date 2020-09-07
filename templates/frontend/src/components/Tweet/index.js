import React, { useState, useRef } from 'react'

import RetweetForm from './components/RetweetForm'

import api from '../../api/tweets'

export default function ({ tweet, tweets, setTweets }) {

	const [likes, setLikes] = useState(tweet.likes || 0)
	const likeBtn = useRef(null)
	const [retweeting, setRetweeting] = useState(false)

	function handleClick() {
		likeBtn.current.disabled = true
		api.toogleLike(tweet.id)
			.then(wasLiked => {
				setLikes(wasLiked ? likes + 1 : likes - 1)
			})
			.catch(err => {
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
			<>
				{tweet.is_retweet && (
					<div className="border-bottom mb-3">
						<p className="mb-1">{tweet.parent.content}</p>
						<span className="small text-muted mr-2">{tweet.parent.likes} Likes</span>
						<span className="small text-muted mr-2">{tweet.parent.retweets} retweets</span>
						<span className="small text-muted">Por {tweet.parent.user.username}</span>
					</div>
				)}
				<p>{tweet.content}</p>
				<div className="d-flex flex-row w-100">
					<button className="btn btn-primary" ref={likeBtn} onClick={handleClick}> {likes} Likes</button>
					<button className="btn btn-outline-primary ml-2" onClick={handleRetweet}>Retweet</button>
					<p className="small text-muted align-self-center mb-0 ml-5">Por {tweet.user.username}</p>
				</div>
			</>
		</>
	)
}