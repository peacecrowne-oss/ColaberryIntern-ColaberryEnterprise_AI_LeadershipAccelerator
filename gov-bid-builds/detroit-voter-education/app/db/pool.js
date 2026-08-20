// Real Postgres connection pool. Only required by the production repository
// implementation (summaryRepository.js) and the migration script — never
// imported by the hermetic test suite.
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

module.exports = { pool };
