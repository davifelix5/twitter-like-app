import React, { useEffect, useState } from 'react'

import Navbar from '../../components/Navbar'
import TweetsList from '../../components/TweetsList'
import Tweet from '../../components/Tweet'
import PostTweetForm from '../../components/PostTweetForm'
import Loader from '../../components/Loader'

import api from '../../api/tweets'
import { updateTweetList } from '../../helpers/updateTweets'

export default function Tweets() {

	const [tweets, setTweets] = useState([])
	useEffect(() => {
		api.index()
			.then(tweets => {
				setTweets(tweets)
			})
	}, [])

	function updateTweets(tweetId, newTweet) {
		const newTweets = updateTweetList(tweets, tweetId, newTweet)
		setTweets(newTweets)
	}

	return (
		<>
			<Navbar />
			<div className="container">
				<div className="row mb-4">
					<PostTweetForm tweets={tweets} setTweets={setTweets} />
				</div>
				<div className="row">
					{tweets.length ? (
						<TweetsList setTweets={setTweets} >
							{tweets.map(tweet => <Tweet tweet={tweet} updateTweets={updateTweets} key={tweet.id} />)}
						</TweetsList>
					) : (
							<div className=" w-100 d-flex justify-content-center">
								<Loader />
							</div>
						)}
				</div>
			</div>
		</>
	)
}