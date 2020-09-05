import React, { useEffect, useState } from 'react'

export default function Tweets() {

    const [tweets, setTweets] = useState([])
    useEffect(() => {
        const url = 'http://127.0.0.1:8000/api/tweets/'
        fetch(url)
            .then(response => response.json())
            .then(data => data.response)
            .then(tweets => {
                setTweets(tweets)
            })
    }, [])

    return (
        <div>
            {tweets ? (
                <ul>
                    {tweets.map(tweet => {
                        return (
                            <li>{tweet.content}</li>
                        )
                    })}
                </ul>
            ) : 'Loading'}
        </div>
    )
}