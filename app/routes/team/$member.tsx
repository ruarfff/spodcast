import React from "react";
import { useRouteData } from "@remix-run/react";
import type { Loader } from "@remix-run/data";

interface User {
  avatar_url: string;
  bio: string;
  company: string;
  location: string;
  name: string;
}

export const loader: Loader = ({ params }) => {
  return fetch(`https://api.github.com/users/${params.member}`);
};

export default function TeamMember(): JSX.Element {
  const user = useRouteData<User>();
  return (
    <div>
      <h3>{user.name}</h3>
      <img alt="user avatar" src={user.avatar_url} height="50" className="inline" />
      <p>{user.bio}</p>
      <dl>
        <dt>Company</dt>
        <dd>{user.company}</dd>
        <dt>Location</dt>
        <dd>{user.location}</dd>
      </dl>
    </div>
  );
}
