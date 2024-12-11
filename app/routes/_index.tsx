import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <article className="prose px-10 py-10 ">
      <li>
        <Link to="/artists">Artists List</Link>
      </li>
    </article>
  );
}
