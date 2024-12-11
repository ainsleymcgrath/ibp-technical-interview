import { openDb } from "~/lib/db";
import { Artist } from "./artists._index";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";

export type ArtistStats = { "???": unknown }; //TODO

export type Album = { AlbumId: number; Title: string; ArtistId: number };

export async function loader({ params }: LoaderFunctionArgs) {
  const db = await openDb();
  const artist = await db.get<Artist>(
    "SELECT * FROM artists WHERE ArtistId = ?",
    params.artistId
  );
  if (!artist) {
    throw new Response("Artist not found", { status: 404 });
  }
  const albums = await db.all<Album[]>(
    "select * from albums where ArtistId = ?",
    params.artistId
  );
  return { artist, albums };
}

export default function ArtistAlbums() {
  const data = useLoaderData<typeof loader>();
  return (
    <article className="prose p-10">
      <h1>{data.artist.Name}</h1>
      {data.albums.map((a) => (
        <figure key={a.AlbumId}>
          <h2>{a.Title}</h2>
          <span className="font-bold">Genres:</span> <span>???</span>
          <details>
            <summary>Track list: (how many tracks?)</summary>
            <ol>
              <li>???</li>
            </ol>
          </details>
        </figure>
      ))}
    </article>
  );
}
