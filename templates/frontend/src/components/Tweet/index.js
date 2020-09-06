import React, { useState } from 'react'

import getCookie from '../../cookies/getCookie'

export default function ({ tweet }) {

	const postHeaders = {
		'Content-Type': 'application/json',
		'X-CSRFToken': getCookie('csrf')
	}
	const BASE_URL = '127.0.0.1:8000'

	const [likes, setLikes] = useState(tweet.likes)
	const [liked, setLiked] = useState(false)

	async function handleLike() {
		const likeUrl = `/api/tweets/like/${tweet.id}/`
		const method = 'PATCH'
		const response = await fetch(BASE_URL + likeUrl, { method, postHeaders })
		if (response.status === 200) {
			setLikes(likes + 1)
			setLiked(true)
			return
		}
	}

	async function handleUnlike() {
		const unlikeUrl = `/api/tweets/unlike/${tweet.id}/`
		const method = 'PATCH'
		const response = await fetch(BASE_URL + unlikeUrl, { method, postHeaders })
		if (response.status === 200) {
			setLikes(likes - 1)
			setLiked(false)
		}
	}

	return (
		<div className="col-12 col-md-10 mx-auto border rounded py-3 mb-4">
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
				<button className="btn btn-outline-primary ml-2" onClick={() => { }}>Retweet</button>
				<p className="small text-muted align-self-center mb-0 ml-5">Por {tweet.user.username}</p>
			</div>
		</div>
	)
}