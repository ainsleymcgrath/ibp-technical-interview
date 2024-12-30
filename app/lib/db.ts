import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function openDb() {
  return open({
    filename: "chinook.db",
    driver: sqlite3.Database,
  });
}

export async function getMany<T extends AnyRecord>(
  db: OpenedDatabase,
  sql: string,
  params: AnyRecord
): Promise<T[]> {
  const result = await db.all<T[]>(sql, params);
  return result.map(maybeParseJsonFieldsInRow);
}

export async function getOne<T extends AnyRecord>(
  db: OpenedDatabase,
  sql: string,
  params: AnyRecord
): Promise<T | undefined> {
  const result = await db.get<T>(sql, params);
  if (typeof result === "undefined") {
    return result;
  }
  return maybeParseJsonFieldsInRow(result);
}

// the node-sqlite package supports _using_ JSON functions,
// but does not automatically parse them to the expected JS types
function maybeParseJsonFieldsInRow(result: AnyRecord) {
  const entriesParsed = Object.entries(result).map(([key, value]) => {
    if (typeof value === "string") {
      try {
        return [key, JSON.parse(value)];
      } catch (e) {
        return [key, value];
      }
    }
    return [key, value];
  });
  return Object.fromEntries(entriesParsed);
}

type OpenedDatabase = Awaited<ReturnType<typeof openDb>>;
type AnyRecord = Record<string, any>;
