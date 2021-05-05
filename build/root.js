'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var react = require('@remix-run/react');
var reactRouterDom = require('react-router-dom');
var firebase = require('firebase/app');
require('firebase/auth');
var jsxRuntime = require('react/jsx-runtime');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var firebase__default = /*#__PURE__*/_interopDefaultLegacy(firebase);

var tailwind = "/build/styles/tailwind__877e315858b569effde7e131a496a0c2868b6968.css";

var styles = "/build/styles/global__1ba7876d90e7e8cda8eda026fc51a5da95f6b5ab.css";

const links = () => {
  return [{
    rel: 'stylesheet',
    href: tailwind
  }, {
    rel: 'stylesheet',
    href: styles
  }];
};
const loader = async () => {
  {
    const config = {
      apiKey: process.env.SPODCAST_FB_API_KEY,
      authDomain: process.env.SPODCAST_FB_AUTH_DOMAIN,
      projectId: process.env.SPODCAST_PROJECT_ID,
      storageBucket: process.env.SPODCAST_STORAGE_BUCKET,
      messagingSenderId: process.env.SPODCAST_MESSAGING_SENDER,
      appId: process.env.SPODCAST_APP_ID,
      measurementId: process.env.SPODCAST_MEASUREMENT_ID
    };
    return {
      config,
      date: new Date()
    };
  }
};
function App() {
  const [fireApp, setFireApp] = React__default['default'].useState();
  const [user, setUser] = React__default['default'].useState();
  const data = react.useRouteData();
  React__default['default'].useEffect(() => {
    if (data.config) {
      setFireApp(firebase__default['default'].initializeApp(data.config));
    } else {
      fetch(`/__/firebase/init.json`).then(result => {
        setFireApp(firebase__default['default'].initializeApp(result.json()));
      });
    }
  }, []);
  React__default['default'].useEffect(() => {
    if (fireApp) {
      try {
        const auth = firebase__default['default'].auth();
        auth.onAuthStateChanged(() => {
          if (auth.currentUser) {
            setUser(auth.currentUser);
          } else {
            setUser(undefined);
          }
        });
      } catch (err) {
        console.error(err);
      }
    }
  }, [fireApp]);
  return /*#__PURE__*/jsxRuntime.jsxs("html", {
    lang: "en",
    children: [/*#__PURE__*/jsxRuntime.jsxs("head", {
      children: [/*#__PURE__*/jsxRuntime.jsx("meta", {
        charSet: "utf-8"
      }), /*#__PURE__*/jsxRuntime.jsx(react.Meta, {}), /*#__PURE__*/jsxRuntime.jsx(react.Links, {})]
    }), /*#__PURE__*/jsxRuntime.jsxs("body", {
      children: [/*#__PURE__*/jsxRuntime.jsxs("div", {
        className: "container mx-auto",
        children: [fireApp ? /*#__PURE__*/jsxRuntime.jsx("p", {
          children: "Initialised"
        }) : /*#__PURE__*/jsxRuntime.jsx("p", {
          children: "Not initialised"
        }), user ? /*#__PURE__*/jsxRuntime.jsx("p", {
          children: JSON.stringify(user)
        }) : /*#__PURE__*/jsxRuntime.jsx("p", {
          children: "Not logged in"
        }), fireApp ? /*#__PURE__*/jsxRuntime.jsx(reactRouterDom.Outlet, {}) : /*#__PURE__*/jsxRuntime.jsx("p", {
          children: "loading"
        })]
      }), /*#__PURE__*/jsxRuntime.jsxs("footer", {
        children: [/*#__PURE__*/jsxRuntime.jsx("div", {
          children: /*#__PURE__*/jsxRuntime.jsx("a", {
            href: "/login",
            children: "Login"
          })
        }), /*#__PURE__*/jsxRuntime.jsx("div", {
          children: /*#__PURE__*/jsxRuntime.jsx(reactRouterDom.Link, {
            to: "/gists",
            children: "Gists"
          })
        }), /*#__PURE__*/jsxRuntime.jsx("div", {
          children: /*#__PURE__*/jsxRuntime.jsx(reactRouterDom.Link, {
            to: "/team",
            children: "Team"
          })
        }), /*#__PURE__*/jsxRuntime.jsxs("p", {
          children: ["This page was rendered at ", data.date.toLocaleString()]
        })]
      }), /*#__PURE__*/jsxRuntime.jsx(react.Scripts, {})]
    })]
  });
}
function ErrorBoundary({
  error
}) {
  return /*#__PURE__*/jsxRuntime.jsxs("html", {
    lang: "en",
    children: [/*#__PURE__*/jsxRuntime.jsxs("head", {
      children: [/*#__PURE__*/jsxRuntime.jsx("meta", {
        charSet: "utf-8"
      }), /*#__PURE__*/jsxRuntime.jsx("title", {
        children: "Oops!"
      })]
    }), /*#__PURE__*/jsxRuntime.jsxs("body", {
      children: [/*#__PURE__*/jsxRuntime.jsxs("div", {
        children: [/*#__PURE__*/jsxRuntime.jsx("h1", {
          children: "App Error"
        }), /*#__PURE__*/jsxRuntime.jsx("pre", {
          children: error.message
        }), /*#__PURE__*/jsxRuntime.jsxs("p", {
          children: ["Replace this UI with what you want users to see when your app throws uncaught errors. The file is at ", /*#__PURE__*/jsxRuntime.jsx("code", {
            children: "app/App.tsx"
          }), "."]
        })]
      }), /*#__PURE__*/jsxRuntime.jsx(react.Scripts, {})]
    })]
  });
}

exports.ErrorBoundary = ErrorBoundary;
exports.default = App;
exports.links = links;
exports.loader = loader;
