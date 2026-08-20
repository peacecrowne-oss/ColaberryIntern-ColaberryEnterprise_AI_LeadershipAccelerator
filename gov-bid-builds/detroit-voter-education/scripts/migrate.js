// Applies app/db/schema.sql to DATABASE_URL. Requires a live Postgres --
// not used by `npm test` (hermetic, in-memory).
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function main() {
    if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL is not set. Copy .env.example to .env and fill it in.');
        process.exit(1);
    }
    const sql = fs.readFileSync(path.join(__dirname, '..', 'app', 'db', 'schema.sql'), 'utf8');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    try {
        await pool.query(sql);
        console.log('[detroit-voter-education] schema applied.');
    } finally {
        await pool.end();
    }
}

main().catch((err) => {
    console.error('[detroit-voter-education] migration failed:', err.message);
    process.exit(1);
});
