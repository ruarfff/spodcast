'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('react');
var react = require('@remix-run/react');
var jsxRuntime = require('react/jsx-runtime');

const loader = ({
  params
}) => {
  return fetch(`https://api.github.com/users/${params.member}`);
};
function TeamMember() {
  const user = react.useRouteData();
  return /*#__PURE__*/jsxRuntime.jsxs("div", {
    children: [/*#__PURE__*/jsxRuntime.jsx("h3", {
      children: user.name
    }), /*#__PURE__*/jsxRuntime.jsx("img", {
      alt: "user avatar",
      src: user.avatar_url,
      height: "50",
      className: "inline"
    }), /*#__PURE__*/jsxRuntime.jsx("p", {
      children: user.bio
    }), /*#__PURE__*/jsxRuntime.jsxs("dl", {
      children: [/*#__PURE__*/jsxRuntime.jsx("dt", {
        children: "Company"
      }), /*#__PURE__*/jsxRuntime.jsx("dd", {
        children: user.company
      }), /*#__PURE__*/jsxRuntime.jsx("dt", {
        children: "Location"
      }), /*#__PURE__*/jsxRuntime.jsx("dd", {
        children: user.location
      })]
    })]
  });
}

exports.default = TeamMember;
exports.loader = loader;
