import { getMany, getOne, openDb } from "~/lib/db";
import { Artist } from "./artists._index";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";

export type ArtistStats = { "???": unknown }; //TODO

export type Album = { AlbumId: number; Title: string; ArtistId: number };

export async function loader({ params }: LoaderFunctionArgs) {
  const db = await openDb();
  const artist = await getOne<Artist>(
    db,
    "SELECT * FROM artists WHERE ArtistId = $artistId",
    { $artistId: params.artistId }
  );
  if (!artist) {
    throw new Response("Artist not found", { status: 404 });
  }
  const albums = await getMany<Album>(
    db,
    "select * from albums where ArtistId = $artistId",
    { $artistId: artist.ArtistId }
  );
  return { artist, albums };
}

export default function ArtistAlbums() {
  const data = useLoaderData<typeof loader>();
  return (
    <article className="prose p-10">
      <h1>{data.artist.Name}</h1>
      {data.albums.map((a) => (
        <AlbumDetail key={a.AlbumId} album={a} />
      ))}
    </article>
  );
}

function AlbumDetail(props: { album: Album }) {
  const { album } = props;
  return (
    <figure key={album.AlbumId}>
      <h2>{album.Title}</h2>
      <span className="font-bold">Genres:</span> <span>???</span>
      {/* https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details */}
      <details>
        <summary>There are ??? tracks on this album:</summary>
        <ol>
          <li>???</li>
        </ol>
      </details>
    </figure>
  );
}
