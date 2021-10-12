const router = require('express').Router();
const Twitter = require('twitter');

var client = new Twitter({
  consumer_key: process.env.CONSUMER_API_KEY,
  consumer_secret: process.env.CONSUMER_API_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

router.get('/search', async (req, res) => {
  const { q, result_type, count } = req.query;
  const search = await client.get('search/tweets.json', {
    q,
    result_type,
    count,
  });
  res.send(search);
});

router.get('/load-more', async (req, res) => {
  const { q, result_type, count, max_id } = req.query;
  const loadMore = await client.get('search/tweets.json', {
    q,
    result_type,
    count,
    max_id,
  });
  res.send(loadMore);
});

module.exports = router;
