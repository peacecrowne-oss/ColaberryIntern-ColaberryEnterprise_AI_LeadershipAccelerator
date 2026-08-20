// Minimal admin review UI for STORY-011. Deliberately small: a pending
// list + approve/reject actions + a notification count. No routing,
// theming, or state library -- matches "ship the smallest version"
// for this story. Auth is the same rehearsal-scope x-admin-key header
// pattern as the backend (see app/routes/summaries.js).
import { useEffect, useState, useCallback } from 'react';

const API_BASE = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3000';

export default function AdminSummaryReview() {
    const [adminKey, setAdminKey] = useState('');
    const [pending, setPending] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchPending = useCallback(async () => {
        if (!adminKey) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/api/summaries/pending`, {
                headers: { 'x-admin-key': adminKey },
            });
            if (!res.ok) throw new Error(`Request failed: ${res.status}`);
            setPending(await res.json());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [adminKey]);

    useEffect(() => {
        fetchPending();
    }, [fetchPending]);

    async function decide(summaryId, decision) {
        const res = await fetch(`${API_BASE}/api/summaries/${summaryId}/${decision}`, {
            method: 'POST',
            headers: { 'x-admin-key': adminKey },
        });
        if (res.ok) fetchPending();
    }

    return (
        <div className="admin-summary-review">
            <h1>Pending Summary Review</h1>

            <label>
                Data steward / admin key
                <input
                    type="password"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    placeholder="x-admin-key"
                />
            </label>
            <button onClick={fetchPending} disabled={!adminKey || loading}>
                {loading ? 'Loading…' : 'Refresh'}
            </button>

            {error && <p role="alert">Error: {error}</p>}

            <p>{pending.length} summar{pending.length === 1 ? 'y' : 'ies'} pending review.</p>

            <ul>
                {pending.map((s) => (
                    <li key={s.summary_id}>
                        <p>{s.content}</p>
                        <small>
                            Created by {s.created_by} at {new Date(s.created_at).toLocaleString()}
                        </small>
                        <div>
                            <button onClick={() => decide(s.summary_id, 'approve')}>Approve</button>
                            <button onClick={() => decide(s.summary_id, 'reject')}>Reject</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
