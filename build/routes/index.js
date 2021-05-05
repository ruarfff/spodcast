'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('@remix-run/react');
var jsxRuntime = require('react/jsx-runtime');

const meta = () => {
  return {
    title: 'Remix Starter',
    description: 'Welcome to remix!'
  };
};
const loader = async () => {
  return {
    message: 'this is awesome 😎'
  };
};
function Index() {
  const data = react.useRouteData();
  return /*#__PURE__*/jsxRuntime.jsxs("div", {
    style: {
      textAlign: 'center',
      padding: 20
    },
    children: [/*#__PURE__*/jsxRuntime.jsx("h2", {
      children: "Welcome to Remix!"
    }), /*#__PURE__*/jsxRuntime.jsxs("p", {
      children: [/*#__PURE__*/jsxRuntime.jsx("a", {
        href: "https://remix.run/dashboard/docs",
        children: "Check out the docs"
      }), " to get started."]
    }), /*#__PURE__*/jsxRuntime.jsxs("p", {
      children: ["Message from the loader: ", data.message]
    })]
  });
}

exports.default = Index;
exports.loader = loader;
exports.meta = meta;
