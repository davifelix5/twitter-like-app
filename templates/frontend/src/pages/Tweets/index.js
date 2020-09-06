import React, { useEffect, useState } from 'react'

import Tweet from '../../components/Tweet'
import Navbar from '../../components/Navbar'
import Loader from '../../components/Loader'

import api from '../../api/tweets'

export default function Tweets() {

	const [tweets, setTweets] = useState([])
	useEffect(() => {
		api.index()
			.then(tweets => {
				setTweets(tweets)
			})
	}, [])

	return (
		<>
			<Navbar />
			{tweets.length ? (
				<div className="container" style={{ flex: 1 }}>
					<ul> {tweets.map(tweet => <Tweet tweet={tweet} key={tweet.id} />)} </ul>
				</div>
			) : (
					<div className="d-flex justify-content-center">
						<Loader />
					</div>
				)
			}
		</>
	)
}