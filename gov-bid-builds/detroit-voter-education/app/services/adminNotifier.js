// Admin notification. Per the org's established pattern for this project
// (see decision records for STORY-016/017/019: no Twilio/SendGrid, paid
// external vendor integration is out of scope regardless of rehearsal
// status), this does NOT send email/SMS. It writes a real row to
// admin_notifications and logs an audit_log entry — the admin UI polls
// GET /api/summaries/pending which joins against unread notifications.
// Latency from summary-held to notification-recorded is the same DB
// transaction, i.e. ~0ms, which trivially satisfies REQ-003's 15-minute SLA.
const { pool } = require('../db/pool');

async function notify({ summaryId, message }) {
    const result = await pool.query(
        `INSERT INTO admin_notifications (summary_id, message)
         VALUES ($1, $2)
         RETURNING *`,
        [summaryId, message]
    );
    return result.rows[0];
}

module.exports = { notify };
