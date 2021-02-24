import type { LinksFunction, LoaderFunction } from "@remix-run/react";
import { Meta, Links, Scripts, useRouteData } from "@remix-run/react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

import tailwind from "css:./styles/tailwind.css";
import styles from "css:./styles/global.css";

export const links: LinksFunction = () => {
  return[
    { rel: "stylesheet", href: tailwind },
    { rel: "stylesheet", href: styles }
  ];
};

export const loader: LoaderFunction = async () => {
  return { date: new Date() };
};

export default function App(): JSX.Element {
  const data = useRouteData();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="container mx-auto">
          <Outlet />
        </div>

        <footer>
          <div>
            <a href="/login">Login</a>
          </div>
          <div>
            <Link to="/gists">Gists</Link>
          </div>
          <div>
            <Link to="/team">Team</Link>
          </div>
          <p>This page was rendered at {data.date.toLocaleString()}</p>
        </footer>
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: { error: Error }): JSX.Element {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Oops!</title>
      </head>
      <body>
        <div>
          <h1>App Error</h1>
          <pre>{error.message}</pre>
          <p>
            Replace this UI with what you want users to see when your app throws
            uncaught errors. The file is at <code>app/App.tsx</code>.
          </p>
        </div>

        <Scripts />
      </body>
    </html>
  );
}
