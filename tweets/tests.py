from django.test import TestCase
from .models import Tweet
from django.contrib.auth.models import User

from rest_framework.test import APIClient


class TweetTestCase(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='testuser1', password='testpassword1')
        self.user2 = User.objects.create_user(username='testuser2', password='testpassword2')
        self.user3 = User.objects.create_user(username='testuser3', password='testpassword3')

        Tweet.objects.bulk_create([
            Tweet(content="test tweet1", user=self.user1),
            Tweet(content="test tweet2", user=self.user1),
            Tweet(content="test tweet3", user=self.user1),
            Tweet(content="test tweet4", user=self.user2),
            Tweet(content="test tweet5", user=self.user2),
            Tweet(content="test tweet6", user=self.user2),
        ])

        self.tweets_count = Tweet.objects.all().count()

    def test_tweet_created(self):
        tweet = Tweet.objects.create(content="some tweet", user=self.user1)
        self.assertEqual(tweet.id, 7)  # 6 tweets have already been created
        self.assertEqual(tweet.user, self.user1)

    def test_tweet_list(self):
        self.client.login(username='testuser1', password='testpassword1')
        list_url = '/api/tweets/'
        response = self.client.get(list_url)
        response_data = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response_data), 2)

    def test_must_be_logged_in_to_tweet(self):
        request_data = {'content': 'This is my first tweet'}
        create_url = '/api/tweets/create/'
        response = self.client.post(create_url, data=request_data)
        self.assertIn(response.status_code, [401, 403])

    def test_tweet_create(self):
        self.client.login(username='testuser3', password='testpassword3')
        request_data = {'content': 'This is my first tweet'}
        create_url = '/api/tweets/create/'
        response = self.client.post(create_url, data=request_data)
        self.assertEqual(response.status_code, 201)

    def test_must_be_logged_in_to_like_tweet(self):
        like_url = '/api/tweets/like/2/'  # Liking the tweet with an ID of 2
        response = self.client.patch(like_url)
        liked_tweet = Tweet.objects.get(pk=2)
        like_count = liked_tweet.likes.all().count()
        self.assertEqual(like_count, 0)
        self.assertIn(response.status_code, [401, 403])

    def test_tweet_action_like(self):
        self.client.login(username='testuser1', password='testpassword1')
        like_url = '/api/tweets/like/2/'  # Liking the tweet with an ID of 2
        response = self.client.patch(like_url)
        liked_tweet = Tweet.objects.get(pk=2)
        like_count = liked_tweet.likes.all().count()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(like_count, 1)

    def test_same_user_must_not_like_tweet_twice(self):
        self.client.login(username='testuser1', password='testpassword1')
        like_url = '/api/tweets/like/2/'  # Liking the tweet with an ID of 2
        liked_tweet = Tweet.objects.get(pk=2)
        self.client.patch(like_url)  # First like
        response = self.client.patch(like_url)  # Must not like again
        like_count = liked_tweet.likes.all().count()
        self.assertEqual(like_count, 1)
        self.assertEqual(response.status_code, 409)

    def test_must_be_logged_in_to_unlike_tweet(self):
        unlike_url = '/api/tweets/unlike/4/'  # Liking the tweet with an ID of 2
        response = self.client.patch(unlike_url)
        self.assertIn(response.status_code, [401, 403])

    def test_must_be_liked_to_unlike(self):
        self.client.login(username='testuser2', password='testpassword2')
        unlike_url = '/api/tweets/unlike/4/'  # Uniking the tweet with an ID of 4
        response = self.client.patch(unlike_url)
        self.assertEqual(response.status_code, 409)

    def test_unlike_action(self):
        self.client.login(username='testuser2', password='testpassword2')
        like_url = '/api/tweets/like/4/'  # Liking the tweet with an ID of 4
        self.client.patch(like_url)
        unlike_url = '/api/tweets/unlike/4/'  # Unliking the tweet with an ID of 4
        response = self.client.patch(unlike_url)
        liked_tweet = Tweet.objects.get(pk=4)
        like_count = liked_tweet.likes.all().count()
        self.assertEqual(like_count, 0)
        self.assertEqual(response.status_code, 200)

    def test_same_user_must_not_unlike_tweet_twice(self):
        self.client.login(username='testuser2', password='testpassword2')
        unlike_url = '/api/tweets/unlike/4/'  # Liking the tweet with an ID of 2
        self.client.patch(unlike_url)
        response = self.client.patch(unlike_url)
        self.assertEqual(response.status_code, 409)

    def test_must_be_logged_in_to_retweet(self):
        retweet_url = '/api/tweets/retweet/5/'  # Retweeting the tweet with an ID of 5
        response = self.client.patch(retweet_url)
        self.assertIn(response.status_code, [401, 403])

    def test_retweet_action(self):
        self.client.login(username='testuser3', password='testpassword3')
        retweet_url = '/api/tweets/retweet/5/'  # Retweeting the tweet with an ID of 5
        response = self.client.post(retweet_url)
        data = response.json()
        self.assertEqual(self.tweets_count + 1, data['response'].get('id'))
        self.assertEqual(response.status_code, 201)

    def test_can_only_delet_own_tweet(self):
        self.client.login(username='testuser3', password='testpassword3')
        delete_url = '/api/tweets/delete/1/'  # The Tweet with an ID of 1 belongs to self.user1
        response = self.client.delete(delete_url)
        self.assertEqual(response.status_code, 401)

    def test_delete_tweet(self):
        self.client.login(username='testuser1', password='testpassword1')
        delete_url = '/api/tweets/delete/1/'
        response = self.client.delete(delete_url)
        self.assertEqual(response.status_code, 200)

    def test_tweet_detail_view(self):
        detail_url = '/api/tweets/1/'
        response = self.client.get(detail_url)
        data = response.json()
        tweet_data = data['response']
        tweet_id = tweet_data.get('id', None)
        self.assertIsNotNone(tweet_id)
        self.assertEquals(tweet_id, 1)
        self.assertEqual(response.status_code, 200)

    def test_non_existing_tweet_detail_view(self):
        detail_url = '/api/tweets/15/'
        response = self.client.get(detail_url)
        data = response.json()
        tweet_data = data.get('response', None)
        self.assertIsNone(tweet_data)
        self.assertEqual(response.status_code, 404)
