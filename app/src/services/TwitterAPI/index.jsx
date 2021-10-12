var express = require('express');
var app = express();
var cors = require('cors');
app.use(cors());
var request = require('request');

var ClientOAuth2 = require('client-oauth2');

const twitterAuth = new ClientOAuth2({
    clientId: '***',
    clientSecret: '***',
    accessTokenUri: 'https://api.twitter.com/oauth2/token',
    authorizationUri: 'https://api.twitter.com/oauth/authorize',
    authorizationGrants: ['credentials'],
    redirectUri: 'http://www.domain.com/cb',
});

app.get('/auth/twitter', function (req, res) {
    twitterAuth.credentials.getToken()
        .then(function (user) {
            res.json(user.data);
        });
});

app.use('/search/twitter/:search', function (req, res) {
    var search = req.params.search;
    // You need to attach the bearer in Authorization header, it will be reused by our proxy.
    var bearer = req.headers.Authorization;

    console.log('search', search);
    console.log('bearer', bearer);

    var url = 'https://api.twitter.com/1.1/search/tweets.json?q=' + search;
    var options = {
        url: 'https://api.twitter.com/1.1/search/tweets.json?q=' + search,
        headers: {
            'Authorization': bearer,
            'Accept-Encoding': 'gzip'
        }
    };

    req.pipe(request(options)).pipe(res);
});

app.listen(4000, function () {
    console.log('Example app listening on port 4000!')
});
