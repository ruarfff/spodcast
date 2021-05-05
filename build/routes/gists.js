'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('react');
var data = require('@remix-run/data');
var react = require('@remix-run/react');
var jsxRuntime = require('react/jsx-runtime');

// Load data for this route and define some caching headers so that when the
// user navigates here multiple times it won't make the request more than once
// per 300 seconds
const loader = async () => {
  const res = await fetch('https://api.github.com/gists');
  return data.json(await res.json(), {
    headers: {
      'Cache-Control': 'max-age=300'
    }
  });
}; // The title and meta tags for the document's <head>

function meta({
  data
}) {
  return {
    title: 'Public Gists',
    description: `View the latest ${data.length} gists from the public`
  };
} // The HTTP headers for the server rendered request, just use the cache control
// from the loader.

function headers({
  loaderHeaders
}) {
  return {
    'Cache-Control': loaderHeaders.get('Cache-Control')
  };
}
function Gists() {
  // useRouteData supports TypeScript generics so you can say what this hook
  // returns
  const data = react.useRouteData();
  return /*#__PURE__*/jsxRuntime.jsxs("div", {
    className: "prose prose-indigo",
    role: "list",
    children: [/*#__PURE__*/jsxRuntime.jsx("div", {
      children: /*#__PURE__*/jsxRuntime.jsx("a", {
        href: "/gists/new",
        children: "New Gist"
      })
    }), /*#__PURE__*/jsxRuntime.jsx("h2", {
      children: "Public Gists"
    }), /*#__PURE__*/jsxRuntime.jsx("ul", {
      className: "list-disc list-inside",
      children: data.map(gist => /*#__PURE__*/jsxRuntime.jsx("li", {
        children: /*#__PURE__*/jsxRuntime.jsx("a", {
          href: gist.html_url,
          children: Object.keys(gist.files)[0]
        })
      }, gist.id))
    })]
  });
}

exports.default = Gists;
exports.headers = headers;
exports.loader = loader;
exports.meta = meta;
