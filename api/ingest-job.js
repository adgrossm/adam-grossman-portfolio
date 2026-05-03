// /api/ingest-job.js
// Receives scored jobs from scanners and writes to Supabase.
// Auth: prefers INGEST_SECRET env var; falls back to ANTHROPIC_API_KEY for backward compat
// during the cutover. Once INGEST_SECRET is set in Vercel and all scanners use jcc-score.js
// (which prefers INGEST_SECRET), the fallback can be removed.

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://koaainzpslvxnriuiuoa.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const INGEST_SECRET = process.env.INGEST_SECRET;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Accept either INGEST_SECRET (preferred) or ANTHROPIC_API_KEY (legacy fallback)
  const authHeader = req.headers.authorization;
  const validSecrets = [INGEST_SECRET, ANTHROPIC_API_KEY].filter(Boolean);
  const isAuthorized = validSecrets.some(secret => authHeader === `Bearer ${secret}`);

  if (!isAuthorized) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const {
    title,
    company,
    listing,
    score,
    feedback,
    keywords,
    resumeUsed,
    applyUrl,
    source,
    location,
    ats
  } = req.body;

  if (!title || !company || !listing) {
    return res.status(400).json({ error: 'Missing required fields: title, company, listing' });
  }

  const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const { data: existing } = await db
    .from('jobs')
    .select('id')
    .eq('title', title)
    .eq('company', company)
    .eq('archived', false)
    .limit(1);

  if (existing && existing.length > 0) {
    return res.status(200).json({ status: 'duplicate', message: `${title} at ${company} already exists` });
  }

  const jobId = String(Date.now() + Math.random());

  const { error } = await db.from('jobs').insert({
    id: jobId,
    title,
    company,
    location: location || '',
    listing,
    apply_url: applyUrl || '',
    score,
    resume_used: resumeUsed || 'AUTO',
    feedback: feedback || '',
    keywords: keywords || { matches: [], missing: [], addToResume: [], hardDisqualifiers: [] },
    status: 'new',
    added_at: new Date().toISOString(),
    notes: '',
    source: source || 'auto',
    ats: ats || null,
    linkedin_url: '',
    archived: false,
    rejection_reason: '',
    resume_pdf_url: null,
    resume_docx_url: null,
    contacts: [],
    qa: [],
    cover_letter: '',
  });

  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ status: 'success', id: jobId, title, company, score });
}
