import { Link, useLoaderData } from "@remix-run/react";
import { openDb } from "~/lib/db";

export type Artist = { Name: string; ArtistId: number };

export async function loader() {
  const db = await openDb();
  const artists = await db.all<Artist[]>("SELECT * FROM artists");
  return artists;
}

export default function ArtistsPage() {
  const artists = useLoaderData<typeof loader>();

  return (
    <article className="prose p-10">
      <ul>
        {artists.map((a) => (
          <li key={a.ArtistId} className="flex gap-4">
            <span className="font-bold">{a.Name}</span>{" "}
            <Link className="link" to={`/artists/${a.ArtistId}/albums`}>
              See albums
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
