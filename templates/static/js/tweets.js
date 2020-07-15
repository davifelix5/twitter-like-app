const BASE_URL = 'http://127.0.0.1:8000'

const tweetsDiv = document.getElementById('tweets')

function handleDidLike(tweetId) {
    const likeBtn = tweetsDiv.querySelector(`#tweet-${tweetId} button`)
    const [number] = /\d+/g.exec(likeBtn.innerHTML)
    likeBtn.innerText = Number(number) + 1 + ' Likes'
}

function renderTweet(tweet, before = false) {
    const tweetDiv = document.createElement('div')
    tweetDiv.classList = 'mb-3 tweet'
    tweetDiv.id = `tweet-${tweet.id}`
    tweetDiv.classList = 'col-12 col-md-10 mx-auto border rounded py-3 mb-4'

    const paragraph = document.createElement('p')
    paragraph.innerHTML = tweet.content

    const likeBtn = document.createElement('button')
    likeBtn.classList = "btn btn-primary"

    likeBtn.innerHTML = `${tweet.likes} likes`
    likeBtn.onclick = () => handleDidLike(tweet.id)

    tweetDiv.append(paragraph)
    tweetDiv.append(likeBtn)
    if (before === true) {
        tweetsDiv.prepend(tweetDiv)
        return
    }
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
            renderTweet(tweet, true)
            break;
        case 400:
            const errors = await response.json()
            const keys = Object.keys(errors)
            keys.forEach(key => {
                const messages = errors[key]
                messages.forEach(msg => handleTweetFormError(msg, true))
            })
            break;
        case 500:
            alert('Sorry, there was a server error! Contact the administrator')
            break;
    }

    form.reset()
}
