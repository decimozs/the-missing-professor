import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "../db/index";

const sqlite = new Database("../../db.sqlite");
const db = drizzle({ client: sqlite, schema });

async function ping() {
  const result = await db.get("SELECT 1");
  console.log(result);
}

ping();
