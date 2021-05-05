'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('react');
var data = require('@remix-run/data');
var crypto = require('crypto');
var sessions = require('../_shared/sessions-0a707939.js');
var jsxRuntime = require('react/jsx-runtime');
require('spotify-web-api-node');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);

const loader = async ({
  request
}) => {
  const session = await sessions.getSession(request.headers.get('Cookie'));
  let state = '';

  if (session.has('state')) {
    state = session.get('state');
  } else {
    state = crypto__default['default'].randomBytes(20).toString('hex');
    session.set('state', state);
  }

  const scopes = ['user-read-private', 'user-read-email'];
  const authorizeURL = sessions.spotifyClient.createAuthorizeURL(scopes, state.toString());
  return data.redirect(authorizeURL, {
    headers: {
      'Set-Cookie': await sessions.commitSession(session)
    }
  });
};
function Login() {
  return /*#__PURE__*/jsxRuntime.jsx("div", {});
}

exports.default = Login;
exports.loader = loader;
