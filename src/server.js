const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const { createRequestHandler } = require("@remix-run/express");

const callback = require('./routes/callback');
const login = require('./routes/login');
const refresh = require('./routes/refresh');

let app = express();

app.use(compression());
app.use(express.static("public"));
app.use(cookieParser());

app.use('/callback', callback);
app.use('/login', login);
app.use('/refresh', refresh);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

if (require.main === module) {
  app.use(express.static("public"));
  app.all(
    "*",
    createRequestHandler({
      getLoadContext(req) {
        return { req }
      },
    })
  );

  let port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Express server started on http://localhost:${port}`);
  });
} else {
  app.all(
    "*",
    createRequestHandler({
      getLoadContext(req) {
        return { req }
      },
    })
  );
}

module.exports = app;
