// In-memory double for adminNotifier.js, same shape, used by the hermetic
// test suite. Records createdAt so the test can assert the 15-minute SLA.
const crypto = require('crypto');

function createInMemoryAdminNotifier() {
    const notifications = [];

    async function notify({ summaryId, message }) {
        const row = {
            notification_id: crypto.randomUUID(),
            summary_id: summaryId,
            message,
            created_at: new Date(),
            read_at: null,
        };
        notifications.push(row);
        return { ...row };
    }

    return { notify, _notifications: notifications };
}

module.exports = { createInMemoryAdminNotifier };
