-- Detroit Voter Education platform schema.
-- STORY-011 scope: summaries + audit_log only. Other tables from
-- requirements.md §4 (users, residents, provenance) are not yet needed
-- and are intentionally not created here.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS summaries (
    summary_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content         TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'pending_review'
                        CHECK (status IN ('pending_review', 'approved', 'rejected')),
    created_by      TEXT NOT NULL,        -- agent name, e.g. 'SummaryGenerationAgent'
    approved_by     TEXT,                 -- admin identifier, set on approve/reject
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    summary_id      UUID NOT NULL REFERENCES summaries(summary_id),
    message         TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    read_at         TIMESTAMPTZ
);

-- Append-only. No UPDATE/DELETE path is exposed anywhere in application code.
CREATE TABLE IF NOT EXISTS audit_log (
    log_id      BIGSERIAL PRIMARY KEY,
    user_id     TEXT,                     -- nullable: system-initiated actions have no user
    action      TEXT NOT NULL,
    details     JSONB NOT NULL DEFAULT '{}'::jsonb,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_summaries_status ON summaries(status);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_summary ON admin_notifications(summary_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);
