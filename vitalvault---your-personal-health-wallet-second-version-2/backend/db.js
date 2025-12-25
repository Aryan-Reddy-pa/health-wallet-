import sqlite3 from "sqlite3";
import path from "path";

const dbPath = path.resolve("healthwallet.db");

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to connect DB", err);
  } else {
    console.log("SQLite DB connected");
  }
});
