'use strict';

var data = require('@remix-run/data');

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
