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
tweetsDiv.innerHTML = 'Loading..'
loadTweets()

function loadTweets() {
    const listUrl = '/api/tweets/'
    fetch(BASE_URL + listUrl)
        .then(response => response.json())
        .then(data => data.response)
        .then(tweets => {
            tweetsDiv.innerHTML = ""
            tweets.forEach(renderTweet)
        })
}

async function handleDidLike(tweet) {
    const likeBtn = tweetsDiv.querySelector(`#tweet-${tweet.id} button`)
    likeBtn.setAttribute('disabled', 'disabled')

    const likeUrl = `/api/tweets/like/${tweet.id}/`
    const method = 'PATCH'
    const response = await fetch(BASE_URL + likeUrl, { method, headers })
    if (response.status === 409) {
        handleDidUnlike(tweet)
        return
    } else if (response.status === 200) {
        loadTweets() // Allows to update the retweets as well
    }
    likeBtn.removeAttribute('disabled')

}

async function handleDidUnlike(tweet) {
    const likeBtn = tweetsDiv.querySelector(`#tweet-${tweet.id} button`)
    likeBtn.setAttribute('disabled', 'disabled')

    const unlikeUrl = `/api/tweets/unlike/${tweet.id}/`
    const method = 'PATCH'
    const response = await fetch(BASE_URL + unlikeUrl, { method, headers })
    if (response.status === 409) {
        return
    } else if (response.status === 200) {
        loadTweets() // Allows to update the retweets as well
    }
    likeBtn.removeAttribute('disabled')
}

function renderRetweetForm(tweet) {

    const existingRetweetDiv = document.getElementById('retweet-div')

    if (existingRetweetDiv) existingRetweetDiv.remove()

    const retweetDiv = document.createElement('div')
    retweetDiv.id = 'retweet-div'
    retweetDiv.classList = 'border rounded'

    const parentTweet = createRetweetSection(tweet)
    parentTweet.classList.add('mb-3')

    const retweetForm = document.createElement('form')
    retweetForm.classList = 'd-flex flex-column'

    const formControl = document.createElement('div')
    formControl.classList = 'form-group'

    const commetInput = document.createElement('textarea')
    commetInput.placeholder = 'Digite seu comentário aqui'
    commetInput.classList = 'form-control'
    commetInput.id = 'comment-input'

    const submitContainer = document.createElement('div')
    submitContainer.classList.add('d-flex', 'justify-content-end')

    const submitBtn = document.createElement('button')
    submitBtn.type = 'submit'
    submitBtn.classList = 'btn btn-lg btn-primary'
    retweetForm.onsubmit = (e) => {
        e.preventDefault()
        handleRetweet({
            parentTweet: tweet,
            content: document.getElementById('comment-input').value
        })
    }

    submitContainer.append(submitBtn)

    const closeBtn = document.createElement('button')
    closeBtn.classList = 'close-btn'
    closeBtn.innerHTML = '&#x274C;'
    closeBtn.onclick = () => retweetDiv.remove()

    submitBtn.innerHTML = 'Retweet'

    formControl.append(commetInput)
    retweetForm.append(formControl)
    retweetForm.append(submitContainer)

    retweetDiv.append(retweetForm)
    retweetDiv.append(closeBtn)

    retweetDiv.prepend(parentTweet)

    document.querySelector('.container').append(retweetDiv)

}

async function handleRetweet({ parentTweet, content }) {
    const retweetUrl = `/api/tweets/retweet/${parentTweet.id}/`
    const method = 'POST'
    const response = await fetch(BASE_URL + retweetUrl, {
        method,
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: content
        })
    })
    if (response.status === 201) {
        document.getElementById('retweet-div').remove()
        loadTweets()
    }
}

function createRetweetSection(parentTweet) {
    const parentContainer = document.createElement('div')
    const parentParagragh = document.createElement('p')
    parentContainer.classList = 'border-bottom mb-3'
    parentParagragh.classList = 'mb-1'

    const likesSpan = document.createElement('span')
    const retweetsSpan = document.createElement('span')
    const authorSpan = document.createElement('span')

    likesSpan.classList = 'small text-muted mr-2'
    retweetsSpan.classList = 'small text-muted mr-2'
    authorSpan.classList = 'small text-muted'

    const likesComplement = parentTweet.likes === 1 ? 'Like' : 'Likes'
    const retweetsComplement = parentTweet.retweets === 1 ? 'Retweet' : 'Retweets'

    parentParagragh.innerHTML = parentTweet.content
    likesSpan.innerHTML = `${parentTweet.likes} ${likesComplement}`
    retweetsSpan.innerHTML = `${parentTweet.retweets} ${retweetsComplement}`
    authorSpan.innerHTML = `Por ${parentTweet.user.username}`

    parentContainer.append(parentParagragh)
    parentContainer.append(likesSpan)
    parentContainer.append(retweetsSpan)
    parentContainer.append(authorSpan)

    return parentContainer
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

    const actionDiv = document.createElement('div')
    actionDiv.classList = 'd-flex flex-row w-100'

    const retweetBtn = document.createElement('button')
    retweetBtn.innerHTML = 'Retweet'
    retweetBtn.classList = 'btn btn-outline-primary ml-2'
    retweetBtn.onclick = () => renderRetweetForm(tweet)

    const userText = document.createElement('span')
    userText.innerHTML = `Por ${tweet.user.username}`
    userText.classList = 'small text-muted align-self-center ml-5'

    tweetDiv.append(paragraph)
    actionDiv.append(likeBtn)
    actionDiv.append(retweetBtn)
    actionDiv.append(userText)
    tweetDiv.append(actionDiv)

    if (tweet.is_retweet) {
        const parentConteiner = createRetweetSection(tweet.parent)
        tweetDiv.prepend(parentConteiner)
    }


    return tweetDiv
}

function renderTweet(tweet) {
    tweetDiv = createTweetDiv(tweet)
    tweetsDiv.append(tweetDiv)
}

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
    setTimeout(() => {
        errorDiv.classList.add('d-none')
        alertElement.remove()
    }, 2500);
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
