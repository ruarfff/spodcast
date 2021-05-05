'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ReactDOMServer = require('react-dom/server');
var Remix = require('@remix-run/react/server');
var jsxRuntime = require('react/jsx-runtime');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var ReactDOMServer__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOMServer);
var Remix__default = /*#__PURE__*/_interopDefaultLegacy(Remix);

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  {
    responseHeaders.set('Cache-Control', 'no-store');
  }

  const markup = ReactDOMServer__default['default'].renderToString( /*#__PURE__*/jsxRuntime.jsx(Remix__default['default'], {
    context: remixContext,
    url: request.url
  }));
  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers: { ...Object.fromEntries(responseHeaders),
      'Content-Type': 'text/html'
    }
  });
}

exports.default = handleRequest;
