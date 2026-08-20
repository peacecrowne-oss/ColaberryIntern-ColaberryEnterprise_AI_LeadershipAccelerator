// Detroit Voter Education platform -- Express entrypoint.
// STORY-011 scope only: wires the CoordinatorAgent to the real Postgres
// repository/notifier/audit-log implementations and mounts /api/summaries.
const express = require('express');

const summaryRepository = require('./services/summaryRepository');
const adminNotifier = require('./services/adminNotifier');
const auditLog = require('./services/auditLog');
const { createCoordinatorAgent } = require('./agents/coordinatorAgent');
const { createSummariesRouter } = require('./routes/summaries');

function createApp() {
    const app = express();
    app.use(express.json());

    const coordinatorAgent = createCoordinatorAgent({
        repository: summaryRepository,
        notifier: adminNotifier,
        auditLog,
    });

    app.get('/health', (_req, res) => res.json({ status: 'ok' }));
    app.use('/api/summaries', createSummariesRouter(coordinatorAgent));

    return app;
}

if (require.main === module) {
    const app = createApp();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`[detroit-voter-education] listening on :${port}`);
    });
}

module.exports = { createApp };
