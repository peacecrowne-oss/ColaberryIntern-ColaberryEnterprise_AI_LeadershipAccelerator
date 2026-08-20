// Stub for the real SummaryGenerationAgent (REQ-003), which is a separate,
// not-yet-built story (STORY-005/010 in the story-driven build guide).
// This exists ONLY so STORY-011's CoordinatorAgent has a realistic input
// to hold for review during local dev/demo/seed. It does not call any LLM
// and does not generate claims about real officeholders or candidates —
// same "don't fabricate claims about real people" boundary the project's
// other decision records already established for this content type.
function generateStubSummary({ zipCode = '48226', issue = 'housing' } = {}) {
    return {
        content:
            `[STUB SUMMARY - not real content, for STORY-011 demo only] ` +
            `Plain-language summary of ${issue} policy positions for officials serving ZIP ${zipCode}. ` +
            `Replace with real SummaryGenerationAgent output once STORY-005/010 are built.`,
        createdBy: 'SummaryGenerationAgent',
    };
}

module.exports = { generateStubSummary };
