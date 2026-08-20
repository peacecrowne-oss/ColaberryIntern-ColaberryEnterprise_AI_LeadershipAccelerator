// Seed entry point. Populates the demo with a few pending summaries via
// the real CoordinatorAgent + pg-backed repository, so a fresh checkout
// has something to review. Requires a live Postgres (see SETUP.md);
// `npm test` does not use this file.
const summaryRepository = require('../app/services/summaryRepository');
const adminNotifier = require('../app/services/adminNotifier');
const auditLog = require('../app/services/auditLog');
const { createCoordinatorAgent } = require('../app/agents/coordinatorAgent');
const { generateStubSummary } = require('../app/agents/summaryGenerationAgentStub');

const SEED_ISSUES = ['housing', 'education', 'public safety'];

async function main() {
    if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL is not set. Copy .env.example to .env and fill it in.');
        process.exit(1);
    }

    const coordinatorAgent = createCoordinatorAgent({
        repository: summaryRepository,
        notifier: adminNotifier,
        auditLog,
    });

    console.log('[detroit-voter-education] seeding pending summaries (reset:', process.env.SEED_RESET === 'true', ')');

    for (const issue of SEED_ISSUES) {
        const generated = generateStubSummary({ zipCode: '48226', issue });
        const { summary } = await coordinatorAgent.receiveSummary(generated);
        console.log(` - held summary ${summary.summary_id} (${issue})`);
    }

    console.log('[detroit-voter-education] seed complete.');
    process.exit(0);
}

main().catch((err) => {
    console.error('[detroit-voter-education] seed failed:', err.message);
    process.exit(1);
});
