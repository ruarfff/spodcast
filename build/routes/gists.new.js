'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('react');
var data = require('@remix-run/data');
var react = require('@remix-run/react');
var jsxRuntime = require('react/jsx-runtime');

const action = async ({
  request
}) => {
  // Very important or else it won't work :)
  const token = process.env.GITHUB_GISTS; // in a real world scenario you'd want this token to be an environment
  // variable on your server, but as long as you only use it in this action, it
  // won't get included in the browser bundle.
  // When the form request posts here, this helper turns it into a FormData

  const body = new URLSearchParams(await request.text()); // pull off what we need from the form, note they are named the same thing
  // as the `<input/>` in the form.

  const fileName = body.get('fileName');
  const content = body.get('content'); // Hit the GitHub API to create a gist

  await fetch('https://api.github.com/gists', {
    method: 'post',
    body: JSON.stringify({
      description: 'Created from Remix Form!',
      public: true,
      files: {
        [fileName]: {
          content
        }
      }
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `token ${token}`
    }
  }); // you always have to redirect from actions

  return data.redirect('/gists');
};

function Loading() {
  return /*#__PURE__*/jsxRuntime.jsx("svg", {
    className: "spin",
    style: {
      height: '1rem'
    },
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    children: /*#__PURE__*/jsxRuntime.jsx("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 2,
      d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    })
  });
}

function NewGist() {
  const pendingForm = react.usePendingFormSubmit();
  return /*#__PURE__*/jsxRuntime.jsxs("div", {
    children: [/*#__PURE__*/jsxRuntime.jsx("h2", {
      children: "New Gist!"
    }), pendingForm ? /*#__PURE__*/jsxRuntime.jsx("div", {
      children: /*#__PURE__*/jsxRuntime.jsxs("p", {
        children: [/*#__PURE__*/jsxRuntime.jsx(Loading, {}), " Creating gist: ", pendingForm.data.get('fileName')]
      })
    }) : /*#__PURE__*/jsxRuntime.jsxs(react.Form, {
      method: "post",
      children: [/*#__PURE__*/jsxRuntime.jsx("p", {
        children: /*#__PURE__*/jsxRuntime.jsxs("label", {
          children: ["Gist file name:", /*#__PURE__*/jsxRuntime.jsx("br", {}), /*#__PURE__*/jsxRuntime.jsx("input", {
            required: true,
            type: "text",
            name: "fileName"
          })]
        })
      }), /*#__PURE__*/jsxRuntime.jsx("p", {
        children: /*#__PURE__*/jsxRuntime.jsxs("label", {
          children: ["Content:", /*#__PURE__*/jsxRuntime.jsx("br", {}), /*#__PURE__*/jsxRuntime.jsx("textarea", {
            required: true,
            rows: 10,
            name: "content"
          })]
        })
      }), /*#__PURE__*/jsxRuntime.jsx("p", {
        children: /*#__PURE__*/jsxRuntime.jsx("button", {
          type: "submit",
          children: "Create Gist"
        })
      })]
    })]
  });
}

exports.action = action;
exports.default = NewGist;
