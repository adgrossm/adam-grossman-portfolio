import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://koaainzpslvxnriuiuoa.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Simple auth check — same key used by scan-jobs
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.ANTHROPIC_API_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { title, company, listing, score, feedback, keywords, resumeUsed, applyUrl, source } = req.body;

  if (!title || !company || !listing) {
    return res.status(400).json({ error: 'Missing required fields: title, company, listing' });
  }

  const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Duplicate check — skip if same title + company already exists
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
    location: '',
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
