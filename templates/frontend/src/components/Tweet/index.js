import React, { useState } from 'react'

import RetweetForm from './components/RetweetForm'

import api from '../../api/tweets'

export default function ({ tweet, tweets, setTweets }) {

	const [likes, setLikes] = useState(tweet.likes || 0)
	const [liked, setLiked] = useState(false)
	const [retweeting, setRetweeting] = useState(false)

	function handleLike() {
		api.like(tweet.id)
			.then(() => {
				setLikes(likes + 1)
				setLiked(true)
			})
			.catch(err => {
				if (err.status === 401) return alert('Você deve estar logado')
				alert(err.message)
			})
	}

	async function handleUnlike() {
		api.unlike(tweet.id)
			.then(() => {
				setLikes(likes - 1)
				setLiked(false)
			})
			.catch(err => {
				alert(err.message)
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
					<button className="btn btn-primary" onClick={liked ? handleUnlike : handleLike}> {likes} Likes</button>
					<button className="btn btn-outline-primary ml-2" onClick={handleRetweet}>Retweet</button>
					<p className="small text-muted align-self-center mb-0 ml-5">Por {tweet.user.username}</p>
				</div>
			</>
		</>
	)
}