import React, { useEffect, useState } from 'react'

import Navbar from '../../components/Navbar'
import TweetsList from '../../components/TweetsList'

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
			<TweetsList tweets={tweets} setTweets={setTweets} />
		</>
	)
}