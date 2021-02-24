const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

router.get('/', function(req, res) {

    const refresh_token = req.query.refresh_token;

    const details = {
      grant_type: 'refresh_token',
          refresh_token: refresh_token
    };

    const formBody = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');


      fetch('https://accounts.spotify.com/api/token', {
        headers: {
          'Authorization': 'Basic ' + (Buffer.from(process.env.SPODCAST_AUTH_CLIENT_ID + ':' + process.env.SPODCAST_AUTH_CLIENT_SECRET).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
        body: formBody
      })
      .then(res => {
        if (!res.statusCode == 200){
          throw new Error()
        }
        return res.json()
      })
      .then(json => {
        const access_token = json.access_token;
          res.send({
            'access_token': access_token
          });
      })
      .catch(() => {
        res.sendStatus(400)
      })

});

module.exports = router;
