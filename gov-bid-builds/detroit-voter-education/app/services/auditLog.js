// Append-only audit log writer (Trust Primer requirement: "an append-only
// record of every meaningful action"). Postgres-backed; no UPDATE/DELETE
// path is exposed anywhere in this codebase.
const { pool } = require('../db/pool');

async function record({ userId = null, action, details = {} }) {
    const result = await pool.query(
        `INSERT INTO audit_log (user_id, action, details) VALUES ($1, $2, $3) RETURNING *`,
        [userId, action, details]
    );
    return result.rows[0];
}

module.exports = { record };
