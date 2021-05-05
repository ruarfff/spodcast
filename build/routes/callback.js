'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var data = require('@remix-run/data');
var react = require('@remix-run/react');
var admin = require('firebase-admin');
var firebase = require('firebase/app');
require('firebase/auth');
var sessions = require('../_shared/sessions-0a707939.js');
var jsxRuntime = require('react/jsx-runtime');
require('spotify-web-api-node');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var admin__default = /*#__PURE__*/_interopDefaultLegacy(admin);
var firebase__default = /*#__PURE__*/_interopDefaultLegacy(firebase);

async function createFirebaseAccount(auth) {
  // The UID we'll assign to the user.
  const uid = `spotify:${auth.spotifyUserID}`;
  const db = admin__default['default'].firestore();
  const docRef = db.collection('spotifyTokens').doc(uid);
  const tokenSaveTask = docRef.set({
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken
  }); // Create or update the user account.

  const userCreationTask = admin__default['default'].auth().updateUser(uid, {
    displayName: auth.displayName,
    photoURL: auth.photoURL,
    email: auth.email,
    emailVerified: true
  }).catch(error => {
    // If user does not exists we create it.
    if (error.code === 'auth/user-not-found') {
      return admin__default['default'].auth().createUser({
        uid: uid,
        displayName: auth.displayName,
        photoURL: auth.photoURL,
        email: auth.email,
        emailVerified: true
      });
    }

    throw error;
  }); // Wait for all async tasks to complete, then generate and return a custom auth token.

  await Promise.all([userCreationTask, tokenSaveTask]); // Create a Firebase custom auth token.

  const token = await admin__default['default'].auth().createCustomToken(uid);
  console.log('Created Custom token for UID "', uid, '" Token:', token);
  return token;
}

const loader = async ({
  request
}) => {
  const session = await sessions.getSession(request.headers.get('Cookie'));
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  let state = '';

  if (session.has('state')) {
    state = session.get('state');
  }

  try {
    if (code) {
      const auth = await new Promise((resolve, reject) => {
        sessions.spotifyClient.authorizationCodeGrant(code, (error, data) => {
          if (error) {
            throw reject(error);
          }

          console.log('Received Access Token:', data.body['access_token']);
          sessions.spotifyClient.setAccessToken(data.body['access_token']);
          const refreshToken = data.body['refresh_token'];
          sessions.spotifyClient.getMe(async (error, userResults) => {
            if (error) {
              reject(error);
            }

            console.log('Auth code exchange result received:', userResults);
            const accessToken = data.body['access_token'];
            const spotifyUserID = userResults.body['id'];
            const photoURL = userResults.body['images'] ? userResults.body['images'][0]['url'] : '';
            const displayName = userResults.body['display_name'] || '';
            const email = userResults.body['email'];
            resolve({
              accessToken,
              refreshToken,
              spotifyUserID,
              displayName,
              photoURL,
              email
            });
          });
        });
      });
      const firebaseToken = await createFirebaseAccount(auth);
      return data.json({
        state,
        token: firebaseToken
      });
    }
  } catch (err) {
    return data.json({
      err
    });
  }
};
function Callback() {
  const data = react.useRouteData();
  React__default['default'].useEffect(() => {
    if (data.token) firebase__default['default'].auth().signInWithCustomToken(data.token);
  }, [data.token]);

  if (data.err) {
    return /*#__PURE__*/jsxRuntime.jsxs("div", {
      children: [/*#__PURE__*/jsxRuntime.jsx("h2", {
        children: "Callback Err"
      }), /*#__PURE__*/jsxRuntime.jsx("p", {
        children: JSON.stringify(data.err)
      })]
    });
  }

  return /*#__PURE__*/jsxRuntime.jsxs("div", {
    children: [/*#__PURE__*/jsxRuntime.jsx("h2", {
      children: "Callback"
    }), /*#__PURE__*/jsxRuntime.jsx("p", {
      children: data.state
    })]
  });
}

exports.default = Callback;
exports.loader = loader;
