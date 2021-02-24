const express = require('express');
const querystring = require('querystring');
const router = express.Router();

router.get('/', function(req, res) {
    const scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
        response_type: 'code',
        client_id: process.env.SPODCAST_AUTH_CLIENT_ID,
        scope: scope,
        redirect_uri: process.env.SPODCAST_AUTH_REDIRECT_URL
        }));
});

module.exports = router;
