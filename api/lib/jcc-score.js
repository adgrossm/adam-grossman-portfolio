// /api/lib/jcc-score.js
// Shared scoring, ingest, and gate-log helpers used by all JCC scanners.

import { ADAM_PROFILE } from './jcc-config.js';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const INGEST_SECRET = process.env.INGEST_SECRET || process.env.ANTHROPIC_API_KEY; // fallback for backward compat
const BASE_URL = process.env.BASE_URL || 'https://adam-grossman-portfolio.vercel.app';
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://koaainzpslvxnriuiuoa.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// ===== SCORE A JOB VIA ANTHROPIC API =====
export async function scoreJob(title, company, listing) {
  const prompt = `${ADAM_PROFILE}

JOB LISTING:
${listing.slice(0, 4000)}

Respond ONLY with valid JSON, no other text:
{
  "score": 72,
  "bestResume": "PM",
  "feedback": "4 to 5 sentence honest assessment. Cover overall fit, any hard disqualifiers, overqualification risk, compensation concerns, and location or remote confirmation. Be direct. No filler.",
  "hardDisqualifiers": [],
  "strengths": ["specific strength from Adam background that directly matches this role"],
  "addToResume": ["skill Adam likely has but should make explicit for this role before applying"],
  "trueGaps": ["skill this role genuinely requires that Adam lacks"]
}`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await res.json();
    const text = data.content?.[0]?.text || '{}';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : '{}');
  } catch (err) {
    console.error(`Score failed: ${title} at ${company}`, err.message);
    return null;
  }
}

// ===== INGEST A SCORED JOB =====
export async function ingestJob(title, company, listing, scoreData, applyUrl, location, ats) {
  try {
    const res = await fetch(`${BASE_URL}/api/ingest-job`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${INGEST_SECRET}`,
      },
      body: JSON.stringify({
        title, company, listing,
        score: scoreData.score,
        feedback: scoreData.feedback,
        resumeUsed: scoreData.bestResume,
        keywords: {
          matches: scoreData.strengths || [],
          missing: scoreData.trueGaps || [],
          addToResume: scoreData.addToResume || [],
          hardDisqualifiers: scoreData.hardDisqualifiers || [],
        },
        applyUrl: applyUrl || '',
        location: location || '',
        source: 'auto',
        ats: ats || null,
      })
    });
    return await res.json();
  } catch (err) {
    console.error(`Ingest failed: ${title} at ${company}`, err.message);
    return null;
  }
}

// ===== LOG A GATE EVENT =====
// Records every gate-rejected job to the gate_log table for diagnostic review.
// Soft gates (HQ tag, anchor day, state exclusion) get logged.
// Hard gates (international, foreign language, single-state non-NC/SC) are silent.
export async function logGateEvent({ title, company, location, applyUrl, ats, reason, severity, scanner }) {
  if (!SUPABASE_SERVICE_KEY) {
    console.warn('SUPABASE_SERVICE_KEY not set, skipping gate log');
    return;
  }

  // Only log soft gates by default; hard gates are too high-volume and clear-cut.
  if (severity !== 'soft') return;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/gate_log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        title,
        company,
        location: location || '',
        apply_url: applyUrl || '',
        ats: ats || null,
        scanner: scanner || null,
        reason,
        severity,
        logged_at: new Date().toISOString()
      })
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error('Gate log insert failed:', res.status, errText);
    }
  } catch (err) {
    console.error('Gate log error:', err.message);
  }
}
