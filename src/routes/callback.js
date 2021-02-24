const express = require('express');
const querystring = require('querystring');
const fetch = require('node-fetch');
const router = express.Router();

router.get('/', function(req, res) {

  const code = req.query.code || null;

  const details = {
    code: code,
    redirect_uri: process.env.SPODCAST_AUTH_REDIRECT_URL,
    grant_type: 'authorization_code'
  };

  const formBody = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');


  fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: formBody,
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(process.env.SPODCAST_AUTH_CLIENT_ID + ':' + process.env.SPODCAST_AUTH_CLIENT_SECRET).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
    .then(res => {
      console.log(res)
      if (!res.statusCode == 200){
        throw new Error()
      }
      return res.json()
    })
    .then(json => {
      const access_token = json.access_token,
          refresh_token = json.refresh_token;

          res.redirect(process.env.SPODCAST_HOME_URL + '?' +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token
            }));
    })
    .catch((err) => {
      console.error(err)
      res.redirect('/error?' +
        querystring.stringify({
          error: 'invalid_token'
        }));
    });
});

module.exports = router;
