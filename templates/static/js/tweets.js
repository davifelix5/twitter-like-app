const BASE_URL = 'http://127.0.0.1:8000'
const headers = {
    'X-CSRFToken': getCookie('csrftoken')
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const tweetsDiv = document.getElementById('tweets')

async function handleDidLike(tweet) {
    const likeBtn = tweetsDiv.querySelector(`#tweet-${tweet.id} button`)
    const [likes] = /\d+/g.exec(likeBtn.innerHTML)

    const likeUrl = `/tweets/like/${tweet.id}/`
    const method = 'PATCH'
    const response = await fetch(BASE_URL + likeUrl, { method, headers })
    if (response.status === 409) {
        handleDidUnlike(tweet)
        return
    } else if (response.status === 200) {
        likeBtn.innerHTML = `${Number(likes) + 1} Likes`
    }

}

async function handleDidUnlike(tweet) {
    const likeBtn = tweetsDiv.querySelector(`#tweet-${tweet.id} button`)
    const [likes] = /\d+/g.exec(likeBtn.innerHTML)

    const unlikeUrl = `/tweets/unlike/${tweet.id}/`
    const method = 'PATCH'
    const response = await fetch(BASE_URL + unlikeUrl, { method, headers })
    if (response.status === 409) {
        return
    } else if (response.status === 200) {
        likeBtn.innerHTML = `${Number(likes) - 1} Likes`
    }
}

function createTweetDiv(tweet) {
    const tweetDiv = document.createElement('div')
    tweetDiv.classList = 'mb-3 tweet'
    tweetDiv.id = `tweet-${tweet.id}`
    tweetDiv.classList = 'col-12 col-md-10 mx-auto border rounded py-3 mb-4'

    const paragraph = document.createElement('p')
    paragraph.innerHTML = tweet.content

    const likeBtn = document.createElement('button')
    likeBtn.classList = "btn btn-primary"

    likeBtn.innerHTML = `${tweet.likes} likes`
    likeBtn.onclick = () => handleDidLike(tweet)

    tweetDiv.append(paragraph)
    tweetDiv.append(likeBtn)

    return tweetDiv
}

function renderTweet(tweet) {
    tweetDiv = createTweetDiv(tweet)
    tweetsDiv.append(tweetDiv)
}

const url = '/tweets/list/'
function loadTweets() {
    fetch(BASE_URL + url)
        .then(response => response.json())
        .then(data => data.response)
        .then(tweets => {
            tweetsDiv.innerHTML = ""
            tweets.forEach(renderTweet)
        })
}

tweetsDiv.innerHTML = 'Loading..'

loadTweets()

const createForm = document.getElementById('create-tweet')
createForm.addEventListener('submit', handleFormSubmit)

function handleTweetFormError(msg) {
    const errorDiv = document.getElementById('tweet-create-form-errors')
    errorDiv.classList.remove('d-none')
    const alertElement = document.createElement('div')
    alertElement.classList.add('alert')
    alertElement.classList.add('alert-danger')
    errorDiv.append(alertElement)

    alertElement.innerHTML = msg
    setTimeout(() => errorDiv.classList.add('d-none'), 2500);
}

async function handleFormSubmit(e) {
    e.preventDefault()
    const form = e.target

    const url = form.getAttribute('action')
    const method = form.getAttribute('method')

    const formData = new FormData(form)

    const response = await fetch(BASE_URL + url, {
        method,
        body: formData,
        headers: {
            'HTTP_X_REQUESTED_WITH': "XMLHttpRequest",
            'X-Requested-With': "XMLHttpRequest",
        }
    })

    switch (response.status) {
        case 201:
            const tweet = await response.json()
            const tweetDiv = createTweetDiv(tweet)
            tweetsDiv.prepend(tweetDiv)
            form.reset()
            break;
        case 403:
            const message = 'You must be logged in to tweet something'
            handleTweetFormError(message)
            break;
        case 401: {
            const message = 'You dont have permission to do that'
            handleTweetFormError(message)
            break;
        }
        case 400:
            const errors = await response.json()
            const keys = Object.keys(errors)
            keys.forEach(key => {
                const messages = errors[key]
                messages.forEach(msg => handleTweetFormError(msg))
            })
            break;
        case 500:
            alert('Sorry, there was a server error! Contact the administrator')
            break;
    }

}
