// In-memory double for auditLog.js, used by the hermetic test suite.
function createInMemoryAuditLog() {
    const entries = [];
    async function record({ userId = null, action, details = {} }) {
        const row = { logId: entries.length + 1, userId, action, details, timestamp: new Date() };
        entries.push(row);
        return row;
    }
    return { record, _entries: entries };
}

module.exports = { createInMemoryAuditLog };
