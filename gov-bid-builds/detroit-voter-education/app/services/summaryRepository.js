// Postgres-backed implementation of the summary repository interface.
// Interface (also implemented by inMemorySummaryRepository.js for tests):
//   create({ content, createdBy }) -> summary row
//   listPending() -> summary rows
//   setStatus(summaryId, status, approvedBy) -> updated summary row
const { pool } = require('../db/pool');

async function create({ content, createdBy }) {
    const result = await pool.query(
        `INSERT INTO summaries (content, created_by, status)
         VALUES ($1, $2, 'pending_review')
         RETURNING *`,
        [content, createdBy]
    );
    return result.rows[0];
}

async function listPending() {
    const result = await pool.query(
        `SELECT * FROM summaries WHERE status = 'pending_review' ORDER BY created_at ASC`
    );
    return result.rows;
}

async function setStatus(summaryId, status, approvedBy) {
    const result = await pool.query(
        `UPDATE summaries
         SET status = $2, approved_by = $3, updated_at = now()
         WHERE summary_id = $1
         RETURNING *`,
        [summaryId, status, approvedBy]
    );
    return result.rows[0];
}

module.exports = { create, listPending, setStatus };
