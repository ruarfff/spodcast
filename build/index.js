var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {enumerable: true, configurable: true, writable: true, value}) : obj[key] = value;
var __objSpread = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
var __commonJS = (cb, mod) => () => (mod || cb((mod = {exports: {}}).exports, mod), mod.exports);
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: true} : {value: module2, enumerable: true})), module2);
};

// node_modules/@remix-run/dev/compiler/shims/react.ts
var React;
var init_react = __esm(() => {
  React = __toModule(require("react"));
});

// empty-module:./firebase/firebaseLoader.client
var require_firebaseLoader = __commonJS((exports, module2) => {
  init_react();
  module2.exports = {};
});

// <stdin>
__markAsModule(exports);
__export(exports, {
  assets: () => import_assets.default,
  entry: () => entry,
  routes: () => routes
});
init_react();

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
init_react();
var import_server = __toModule(require("react-dom/server"));
var import_remix = __toModule(require("remix"));
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  if (process.env.NODE_ENV !== "production") {
    responseHeaders.set("Cache-Control", "no-store");
  }
  const markup = import_server.default.renderToString(/* @__PURE__ */ React.createElement(import_remix.RemixServer, {
    context: remixContext,
    url: request.url
  }));
  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: __objSpread(__objSpread({}, Object.fromEntries(responseHeaders)), {
      "Content-Type": "text/html"
    })
  });
}

// route-module:/Users/ruairi/Dev/spodcast/app/root.tsx
var root_exports = {};
__export(root_exports, {
  ErrorBoundary: () => ErrorBoundary,
  default: () => App,
  links: () => links,
  loader: () => loader
});
init_react();
var import_react = __toModule(require("react"));
var import_react2 = __toModule(require("@remix-run/react"));
var import_react_router_dom = __toModule(require("react-router-dom"));

// app/firebase/firebaseLoader.server.ts
init_react();
var import_firebase_admin = __toModule(require("firebase-admin"));

// app/spotify/spotifyClient.ts
init_react();
var import_spotify_web_api_node = __toModule(require("spotify-web-api-node"));

// app/conf.ts
init_react();
var import_firebase_functions = __toModule(require("firebase-functions"));
function getSpotifyConfiguration() {
  if (process.env.NODE_ENV !== "production") {
    return {
      clientId: process.env.SPODCAST_AUTH_CLIENT_ID,
      clientSecret: process.env.SPODCAST_AUTH_CLIENT_SECRET,
      redirectUri: process.env.SPODCAST_AUTH_REDIRECT_URL
    };
  }
  return {
    clientId: import_firebase_functions.default.config().spodcast.spotify.client,
    clientSecret: import_firebase_functions.default.config().spodcast.spotify.secret,
    redirectUri: import_firebase_functions.default.config().spodcast.spotify.redirect
  };
}
function getSessionSecret() {
  if (process.env.NODE_ENV !== "production") {
    return process.env.SPODCAST_SESSION_SECRET || "r3m1xr0ck5";
  }
  return import_firebase_functions.default.config().spodcast.session.secret;
}

// app/spotify/spotifyClient.ts
var {clientId, clientSecret, redirectUri} = getSpotifyConfiguration();
var spotifyClient = new import_spotify_web_api_node.default({
  clientId,
  clientSecret,
  redirectUri
});
var spotifyClient_default = spotifyClient;

// app/firebase/firebaseLoader.server.ts
function loadConfigFromEnv() {
  return {
    apiKey: process.env.SPODCAST_FB_API_KEY || "",
    authDomain: process.env.SPODCAST_FB_AUTH_DOMAIN || "",
    projectId: process.env.SPODCAST_PROJECT_ID || "",
    storageBucket: process.env.SPODCAST_STORAGE_BUCKET || "",
    messagingSenderId: process.env.SPODCAST_MESSAGING_SENDER || "",
    appId: process.env.SPODCAST_APP_ID || "",
    measurementId: process.env.SPODCAST_MEASUREMENT_ID || ""
  };
}
async function getToken(code) {
  const auth = await new Promise((resolve, reject) => {
    spotifyClient_default.authorizationCodeGrant(code, (error, data) => {
      if (error) {
        throw reject(error);
      }
      spotifyClient_default.setAccessToken(data.body["access_token"]);
      const refreshToken = data.body["refresh_token"];
      spotifyClient_default.getMe(async (error2, userResults) => {
        if (error2) {
          reject(error2);
        }
        const accessToken = data.body["access_token"];
        const spotifyUserID = userResults.body["id"];
        const photoURL = userResults.body["images"] ? userResults.body["images"][0]["url"] : "";
        const displayName = userResults.body["display_name"] || "";
        const email = userResults.body["email"];
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
  return await createFirebaseAccount(auth);
}
async function createFirebaseAccount(auth) {
  const uid = `spotify:${auth.spotifyUserID}`;
  const db = import_firebase_admin.default.firestore();
  const docRef = db.collection("spotifyTokens").doc(uid);
  const tokenSaveTask = docRef.set({
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken
  });
  const userCreationTask = import_firebase_admin.default.auth().updateUser(uid, {
    displayName: auth.displayName,
    photoURL: auth.photoURL,
    email: auth.email,
    emailVerified: true
  }).catch((error) => {
    if (error.code === "auth/user-not-found") {
      return import_firebase_admin.default.auth().createUser({
        uid,
        displayName: auth.displayName,
        photoURL: auth.photoURL,
        email: auth.email,
        emailVerified: true
      });
    }
    throw error;
  });
  await Promise.all([userCreationTask, tokenSaveTask]);
  return await import_firebase_admin.default.auth().createCustomToken(uid);
}

// route-module:/Users/ruairi/Dev/spodcast/app/root.tsx
var import_firebaseLoader2 = __toModule(require_firebaseLoader());

// app/user/userAuth.ts
init_react();
var import_app = __toModule(require("firebase/app"));
function watchUserAuth(authClient, callback) {
  const auth = authClient.auth();
  auth.onAuthStateChanged(() => {
    if (auth.currentUser) {
      const {uid, displayName, photoURL, email} = auth.currentUser;
      const user = {
        uid,
        displayName,
        photoURL,
        email
      };
      callback(user);
    } else {
      callback(void 0);
    }
  });
}
async function logout() {
  await import_app.default.auth().signOut();
}
async function login(token) {
  const d = new Date().valueOf();
  const epoch = d / 1e3;
  if (window.location.hostname == "localhost")
    import_app.default.auth().useEmulator("http://localhost:9099/");
  await import_app.default.auth().signInWithCustomToken(token.trim());
}

// app/styles/tailwind.css
var tailwind_default = "/build/_assets/tailwind-VRKXZ6GQ.css";

// route-module:/Users/ruairi/Dev/spodcast/app/root.tsx
var links = () => {
  return [
    {rel: "stylesheet", href: tailwind_default}
  ];
};
var loader = async () => {
  let config = null;
  if (process.env.NODE_ENV !== "production") {
    config = loadConfigFromEnv();
  }
  return {config, date: new Date()};
};
function App() {
  const [user, setUser] = import_react.default.useState();
  const [loaded, setLoaded] = import_react.default.useState(false);
  const data = (0, import_react2.useRouteData)();
  import_react.default.useEffect(() => {
    const loadApp = async () => {
      const app = await (0, import_firebaseLoader2.loadFirebase)(data.config);
      watchUserAuth(app, setUser);
      setLoaded(true);
    };
    loadApp();
  }, []);
  return /* @__PURE__ */ import_react.default.createElement("html", {
    lang: "en",
    className: "dark"
  }, /* @__PURE__ */ import_react.default.createElement("head", null, /* @__PURE__ */ import_react.default.createElement("meta", {
    charSet: "utf-8"
  }), /* @__PURE__ */ import_react.default.createElement(import_react2.Meta, null), /* @__PURE__ */ import_react.default.createElement(import_react2.Links, null)), /* @__PURE__ */ import_react.default.createElement("body", null, /* @__PURE__ */ import_react.default.createElement("div", {
    className: "container mx-auto dark:bg-black"
  }, user ? /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("button", {
    onClick: () => {
      logout();
    }
  }, "Logout")), /* @__PURE__ */ import_react.default.createElement("p", null, "Hello ", user.displayName)) : /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("a", {
    href: "/login"
  }, "Login")), loaded ? /* @__PURE__ */ import_react.default.createElement(import_react_router_dom.Outlet, null) : /* @__PURE__ */ import_react.default.createElement("h2", null, "Loading...")), /* @__PURE__ */ import_react.default.createElement("footer", null, /* @__PURE__ */ import_react.default.createElement("p", null, "This page was rendered at ", data.date.toLocaleString())), /* @__PURE__ */ import_react.default.createElement(import_react2.Scripts, null), process.env.NODE_ENV === "development" && /* @__PURE__ */ import_react.default.createElement(import_react2.LiveReload, null)));
}
function ErrorBoundary({error}) {
  return /* @__PURE__ */ import_react.default.createElement("html", {
    lang: "en"
  }, /* @__PURE__ */ import_react.default.createElement("head", null, /* @__PURE__ */ import_react.default.createElement("meta", {
    charSet: "utf-8"
  }), /* @__PURE__ */ import_react.default.createElement("link", {
    rel: "icon",
    href: "/favicon.png",
    type: "image/png"
  }), /* @__PURE__ */ import_react.default.createElement("title", null, "Oops!")), /* @__PURE__ */ import_react.default.createElement("body", null, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h1", null, "App Error"), /* @__PURE__ */ import_react.default.createElement("pre", null, error.message), /* @__PURE__ */ import_react.default.createElement("p", null, "Sorry! Something bad happened."), /* @__PURE__ */ import_react.default.createElement("a", {
    href: "/"
  }, "Go back")), /* @__PURE__ */ import_react.default.createElement(import_react2.Scripts, null)));
}

// route-module:/Users/ruairi/Dev/spodcast/app/routes/404.tsx
var __exports = {};
__export(__exports, {
  default: () => FourOhFour,
  meta: () => meta
});
init_react();
var meta = () => {
  return {title: "Ain't nothing here"};
};
function FourOhFour() {
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", null, "404"));
}

// route-module:/Users/ruairi/Dev/spodcast/app/routes/callback.tsx
var callback_exports = {};
__export(callback_exports, {
  default: () => Callback,
  loader: () => loader2
});
init_react();
var import_remix2 = __toModule(require("remix"));
var import_react3 = __toModule(require("react"));
var import_react_router_dom2 = __toModule(require("react-router-dom"));

// app/sessions.ts
init_react();
var import_node = __toModule(require("@remix-run/node"));
var {
  getSession,
  commitSession,
  destroySession
} = (0, import_node.createCookieSessionStorage)({
  cookie: {
    name: "__session",
    secrets: [getSessionSecret()],
    maxAge: 36e5,
    secure: true,
    httpOnly: true
  }
});

// route-module:/Users/ruairi/Dev/spodcast/app/routes/callback.tsx
var loader2 = async ({request}) => {
  const session = await getSession(request.headers.get("Cookie"));
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  let state = "";
  if (session.has("state")) {
    state = session.get("state");
  }
  try {
    if (code) {
      const firebaseToken = await getToken(code);
      return (0, import_remix2.json)({state, token: firebaseToken});
    }
  } catch (err) {
    return (0, import_remix2.json)({err});
  }
};
function Callback() {
  const data = (0, import_remix2.useRouteData)();
  const navigate = (0, import_react_router_dom2.useNavigate)();
  import_react3.default.useEffect(() => {
    const handleCallback = async () => {
      if (data.token) {
        await login(data.token);
        navigate("/");
      }
    };
    handleCallback();
  }, [data.token]);
  if (data.err) {
    return /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("h2", null, "Callback Err"), /* @__PURE__ */ import_react3.default.createElement("p", null, JSON.stringify(data.err)));
  }
  return /* @__PURE__ */ import_react3.default.createElement("h2", null, "Logging in");
}

// route-module:/Users/ruairi/Dev/spodcast/app/routes/index.tsx
var routes_exports = {};
__export(routes_exports, {
  default: () => Index,
  loader: () => loader3,
  meta: () => meta2
});
init_react();
var import_remix3 = __toModule(require("remix"));
var meta2 = () => {
  return {
    title: "Spodcast",
    description: "Manage your Spotify podcasts"
  };
};
var loader3 = async () => {
  return {message: "this is awesome \u{1F60E}"};
};
function Index() {
  const data = (0, import_remix3.useRouteData)();
  return /* @__PURE__ */ React.createElement("div", {
    style: {textAlign: "center", padding: 20},
    className: "bg-green-500"
  }, /* @__PURE__ */ React.createElement("h2", null, "Welcome to Remix!"), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("a", {
    href: "https://remix.run/dashboard/docs"
  }, "Check out the docs"), " to get started."), /* @__PURE__ */ React.createElement("p", null, "Message from the loader: ", data.message));
}

// route-module:/Users/ruairi/Dev/spodcast/app/routes/login.tsx
var login_exports = {};
__export(login_exports, {
  default: () => Login,
  loader: () => loader4
});
init_react();
var import_remix4 = __toModule(require("remix"));
var import_crypto = __toModule(require("crypto"));
var loader4 = async ({request}) => {
  const session = await getSession(request.headers.get("Cookie"));
  let state = "";
  if (session.has("state")) {
    state = session.get("state");
  } else {
    state = import_crypto.default.randomBytes(20).toString("hex");
    session.set("state", state);
  }
  const scopes = ["user-read-private", "user-read-email"];
  const authorizeURL = spotifyClient_default.createAuthorizeURL(scopes, state.toString());
  return (0, import_remix4.redirect)(authorizeURL, {
    headers: {
      "Set-Cookie": await commitSession(session)
    }
  });
};
function Login() {
  return /* @__PURE__ */ React.createElement("div", null);
}

// <stdin>
var import_assets = __toModule(require("./assets.json"));
var entry = {module: entry_server_exports};
var routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "/",
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/404": {
    id: "routes/404",
    parentId: "root",
    path: "*",
    caseSensitive: false,
    module: __exports
  },
  "routes/callback": {
    id: "routes/callback",
    parentId: "root",
    path: "callback",
    caseSensitive: false,
    module: callback_exports
  },
  "routes/index": {
    id: "routes/index",
    parentId: "root",
    path: "/",
    caseSensitive: false,
    module: routes_exports
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    caseSensitive: false,
    module: login_exports
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assets,
  entry,
  routes
});
