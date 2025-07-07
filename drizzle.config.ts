import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/index.ts",
  out: "./migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "file:./db.sqlite",
  },
});
