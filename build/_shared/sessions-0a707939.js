'use strict';

var SpotifyWebApi = require('spotify-web-api-node');
var data = require('@remix-run/data');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var SpotifyWebApi__default = /*#__PURE__*/_interopDefaultLegacy(SpotifyWebApi);

const spotifyClient = new SpotifyWebApi__default['default']({
  clientId: process.env.SPODCAST_AUTH_CLIENT_ID,
  clientSecret: process.env.SPODCAST_AUTH_CLIENT_SECRET,
  redirectUri: process.env.SPODCAST_AUTH_REDIRECT_URL
});

const {
  getSession,
  commitSession,
  destroySession
} = data.createCookieSessionStorage({
  cookie: {
    name: '__session',
    maxAge: 3600000,
    secure: true,
    httpOnly: true
  }
});

exports.commitSession = commitSession;
exports.getSession = getSession;
exports.spotifyClient = spotifyClient;
