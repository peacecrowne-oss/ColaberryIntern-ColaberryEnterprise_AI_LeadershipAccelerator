// REST routes for STORY-011. Mounted at /api/summaries in app/server.js.
// Command -> Event -> Read-model slice:
//   POST /api/summaries/generated  (Command: SummaryGenerationAgent hands off a summary)
//   GET  /api/summaries/pending    (Read-model: admin review queue)
//   POST /api/summaries/:id/approve | /reject  (Command: admin decision)
const express = require('express');

// Rehearsal-scope admin auth: a single shared key compared via header,
// same posture as this project's other admin routes (see decision records
// for STORY-022/024) -- explicitly not production-grade authentication.
function requireAdminKey(req, res, next) {
    if (!process.env.ADMIN_API_KEY || req.headers['x-admin-key'] !== process.env.ADMIN_API_KEY) {
        return res.status(401).json({ error: 'Missing or invalid x-admin-key header' });
    }
    next();
}

function createSummariesRouter(coordinatorAgent) {
    const router = express.Router();

    // Internal endpoint: SummaryGenerationAgent (or its stub) calls this
    // when a new summary is ready. Not admin-authenticated -- it is a
    // server-to-server agent handoff, not a public or admin-facing route.
    router.post('/generated', async (req, res) => {
        try {
            const { content, createdBy } = req.body;
            const result = await coordinatorAgent.receiveSummary({ content, createdBy });
            res.status(201).json(result);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

    router.get('/pending', requireAdminKey, async (_req, res) => {
        const pending = await coordinatorAgent.listPendingForReview();
        res.json(pending);
    });

    router.post('/:id/approve', requireAdminKey, async (req, res) => {
        try {
            const updated = await coordinatorAgent.recordAdminDecision(req.params.id, 'approved', 'admin');
            res.json(updated);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

    router.post('/:id/reject', requireAdminKey, async (req, res) => {
        try {
            const updated = await coordinatorAgent.recordAdminDecision(req.params.id, 'rejected', 'admin');
            res.json(updated);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

    return router;
}

module.exports = { createSummariesRouter };
