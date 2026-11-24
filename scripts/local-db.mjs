// Local Postgres for development (no Docker needed): `npm run db:local`, then use
// DATABASE_URL=postgres://mosh:mosh@localhost:54329/moshrooms in .env.local
import EmbeddedPostgres from "embedded-postgres";
import { existsSync } from "node:fs";

const dir = process.env.LOCAL_DB_DIR || ".localdb";
const pg = new EmbeddedPostgres({ databaseDir: dir, user: "mosh", password: "mosh", port: 54329, persistent: true });
const fresh = !existsSync(`${dir}/PG_VERSION`);
if (fresh) await pg.initialise();
await pg.start();
if (fresh) await pg.createDatabase("moshrooms");
console.log("Local Postgres ready → postgres://mosh:mosh@localhost:54329/moshrooms (Ctrl+C to stop)");
const stop = async () => { await pg.stop(); process.exit(0); };
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
