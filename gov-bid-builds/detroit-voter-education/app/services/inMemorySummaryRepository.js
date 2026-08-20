// In-memory implementation of the same interface as summaryRepository.js.
// Used by the hermetic test suite and by `npm run dev -- --no-db` style
// local exploration. Never used in production (DATABASE_URL set => the
// real pg-backed repository is used instead; see app/server.js).
const crypto = require('crypto');

function createInMemorySummaryRepository() {
    const rows = new Map();

    async function create({ content, createdBy }) {
        const now = new Date();
        const row = {
            summary_id: crypto.randomUUID(),
            content,
            status: 'pending_review',
            created_by: createdBy,
            approved_by: null,
            created_at: now,
            updated_at: now,
        };
        rows.set(row.summary_id, row);
        return { ...row };
    }

    async function listPending() {
        return [...rows.values()]
            .filter((r) => r.status === 'pending_review')
            .sort((a, b) => a.created_at - b.created_at)
            .map((r) => ({ ...r }));
    }

    async function setStatus(summaryId, status, approvedBy) {
        const row = rows.get(summaryId);
        if (!row) return undefined;
        row.status = status;
        row.approved_by = approvedBy;
        row.updated_at = new Date();
        return { ...row };
    }

    return { create, listPending, setStatus, _rows: rows };
}

module.exports = { createInMemorySummaryRepository };
