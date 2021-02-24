import type { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return { title: "Ain't nothing here" };
};

export default function FourOhFour(): JSX.Element {
  return (
    <div>
      <h1>404</h1>
    </div>
  );
}
