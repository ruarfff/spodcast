'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('react');
var reactRouterDom = require('react-router-dom');
var react = require('@remix-run/react');
var jsxRuntime = require('react/jsx-runtime');

const loader = () => {
  // you can point to whatever org you want, ofc
  return fetch('https://api.github.com/orgs/reacttraining/members');
};
function Team() {
  const data = react.useRouteData();
  return /*#__PURE__*/jsxRuntime.jsxs("div", {
    children: [/*#__PURE__*/jsxRuntime.jsx("h2", {
      children: "Team"
    }), /*#__PURE__*/jsxRuntime.jsx("ul", {
      children: data.map(member => /*#__PURE__*/jsxRuntime.jsx("li", {
        children: /*#__PURE__*/jsxRuntime.jsx(reactRouterDom.Link, {
          to: member.login,
          children: member.login
        })
      }, member.id))
    }), /*#__PURE__*/jsxRuntime.jsx("hr", {}), /*#__PURE__*/jsxRuntime.jsx(reactRouterDom.Outlet, {})]
  });
}

exports.default = Team;
exports.loader = loader;
