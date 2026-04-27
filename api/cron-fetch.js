const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://koaainzpslvxnriuiuoa.supabase.co';
const SUPABASE_KEY = 'sb_publishable_biLMaC_FHIyiMl4aaVDZbQ_CvQ6pk3J';

const RAPIDAPI_KEY = '94d3a3a9e2mshf2a105cfc00cb25p170064jsn99fd4a9cd9c9';
const ADZUNA_APP_ID = '5642cb53';
const ADZUNA_APP_KEY = '412778579a4c1b75af288f7ca65d4dee';
const SERPAPI_KEY = '918e5b4816f7378486fa14a8b4d3622f23106bfc69ca1853a118e908c085aff1';
const ANTHROPIC_KEY = process.env.ANTHROPIC_KEY;

const SEARCHES = [
  'Customer Success Manager remote',
  'Implementation Manager remote',
  'Senior Project Manager SaaS remote',
  'Customer Success Manager SaaS',
  'Implementation Consultant ERP remote',
];

const BLOCKED_DOMAINS = ['jobleads', 'jobgether', 'jooble', 'talent.com', 'jobrapido', 'hireza', 'hirevector', 'careerly', 'jobflarely', 'whatjobs', 'bebee', 'asobbi', 'learn4good', 'dynamitejobs', 'synamitejobs', 'up2staff', 'dailyremote'];

const ALLOWED_LOCATIONS = ['remote', 'charlotte', 'fort mill', 'indian land', 'rock hill', 'gastonia', 'concord', 'mooresville', 'huntersville', 'ballantyne'];

const MIN_SCORE = 65;

const RESUMES = {
  csm: `Senior Customer Success Manager with 15+ years of experience. Skills: Customer Lifecycle & Renewal Strategy, Executive Stakeholder Engagement, Net Revenue Retention & Expansion Growth, Customer Health Monitoring, SaaS & ERP Customer Success, Risk & Escalation Management, Cross-Functional Collaboration, Executive QBRs, Data-Driven Performance Reviews, Change Management, Customer Value Realization, Voice of Customer Programs, Client Training & Enablement, Customer Success Playbooks, AI-Assisted Documentation. Tools: Jira, Confluence, Salesforce, HubSpot, Monday.com, Zoho. Experience: Grew portfolio ARR from $1.7M to $2.4M achieving 108% NRR. 95% logo retention across 58 clients. $700K expansion ARR. Built first CS framework with playbooks, health scoring, renewal forecasting. NPS of 85.`,
  pm: `Program & Project Manager with 15+ years. Skills: Project Planning & Scheduling, Requirements Gathering, Quality Assurance, Risk Identification & Mitigation, SDLC, Change Control & Scope Management, Cross-Functional Team Collaboration, Executive Stakeholder Alignment, Delivery Governance, Agile & Waterfall, Sprint Planning & Backlog Management, Compliance-Aware Project Execution. Tools: Jira, Confluence, Salesforce, HubSpot, Monday.com, Microsoft Project. Certifications: PSM I, PMP In Progress. Experience: $6M+ total program value across 16 ERP implementations. Led 75+ global resources. Reduced implementation timelines by 40%.`,
  impl: `Implementation Project Manager with 4.5 years ERP/SaaS implementation experience and 15+ years project management. Skills: ERP Implementation Lifecycle, Client Onboarding & Go-Live Execution, SOP & Delivery Framework Development, Agile Sprint Planning, SDLC, Cross-Functional Team Leadership, Jira-Based Project Management, Requirements Gathering, Risk Identification, Executive Stakeholder Communication, UAT Coordination & QA Oversight, Change Management & User Adoption, Post-Launch Stabilization. Experience: 16 Odoo ERP implementations averaging $75K each. Rebuilt 15+ at-risk implementations. Built company's first implementation SOPs. Reduced timelines 40%, cut post-go-live issues 20%.`
};

async function fetchAdzunaJobs(query) {
  const encoded = encodeURIComponent(query);
  const url = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=10&what=${encoded}&max_days_old=3`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return (data.results || []).map(job => ({
      job_id: job.id,
      job_title: job.title,
      employer_name: job.company?.display_name || 'Unknown',
      job_city: job.location?.area?.[2] || null,
      job_state: job.location?.area?.[1] || null,
      job_is_remote: job.title.toLowerCase().includes('remote') || (job.description || '').toLowerCase().includes('remote'),
      job_description: job.description,
      job_apply_link: job.redirect_url,
      job_source: 'adzuna',
    }));
  } catch(err) {
    return [];
  }
}

async function fetchIndeedJobs(query) {
  const encoded = encodeURIComponent(query);
  const url = `https://serpapi.com/search.json?engine=indeed&q=${encoded}&l=remote&fromage=3&api_key=${SERPAPI_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return (data.jobs_results || []).map(job => ({
      job_id: job.job_id || job.title + job.company_name,
      job_title: job.title,
      employer_name: job.company_name || 'Unknown',
      job_city: null,
      job_state: null,
      job_is_remote: true,
      job_description: job.description || job.snippet || '',
      job_apply_link: job.link || '',
      job_source: 'indeed',
    }));
  } catch(err) {
    return [];
  }
}

async function scoreJob(job) {
  const listing = `Job Title: ${job.job_title}\nCompany: ${job.employer_name}\nDescription: ${job.job_description?.slice(0, 3000)}`.trim();
  const prompt = `You are a career coach. Score this job listing against Adam Grossman's three resumes and pick the best match.\n\nJOB LISTING:\n${listing}\n\nCSM RESUME: ${RESUMES.csm}\n\nPM RESUME: ${RESUMES.pm}\n\nIMPLEMENTATION RESUME: ${RESUMES.impl}\n\nRespond ONLY with valid JSON:\n{"score": 82, "bestResume": "CSM", "feedback": "2-3 sentence analysis", "matchedKeywords": ["kw1","kw2","kw3"], "missingKeywords": ["miss1","miss2"]}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 800, messages: [{ role: 'user', content: prompt }] })
  });
  const data = await res.json();
  const text = data.content?.[0]?.text || '{}';
  return JSON.parse(text.replace(/```json\n?|```\n?/g, '').trim());
}

module.exports = async function handler(req, res) {
  const db = createClient(SUPABASE_URL, SUPABASE_KEY);
  const seen = new Set();
  const results = [];

  for (const query of SEARCHES) {
    const adzunaJobs = (await fetchAdzunaJobs(query)).map(j => ({ ...j, job_source: 'adzuna' }));
    const indeedJobs = (await fetchIndeedJobs(query)).map(j => ({ ...j, job_source: 'indeed' }));
    const jobs = [...adzunaJobs, ...indeedJobs];

    for (const job of jobs) {
      if (seen.has(job.job_id)) continue;
      seen.add(job.job_id);
      if (!job.job_description || job.job_description.length < 100) continue;

      const locationText = `${job.job_city || ''} ${job.job_state || ''}`.toLowerCase();
      const titleAndDesc = `${job.job_title || ''} ${job.job_description?.slice(0, 500) || ''}`.toLowerCase();
      const isRemote = job.job_is_remote || titleAndDesc.includes('remote') || locationText.includes('remote');
      const isAllowed = isRemote || ALLOWED_LOCATIONS.some(loc => locationText.includes(loc));
      if (!isAllowed) continue;
      const descText = (job.job_description || '').toLowerCase();
const titleText = (job.job_title || '').toLowerCase();
const isEurope = descText.includes('europe') || descText.includes('uk only') || descText.includes('emea') || descText.includes('must be based in') || descText.includes('eligible to work in the uk') || descText.includes('right to work in') || locationText.includes('europe') || titleText.includes('europe');
if (isEurope) continue;

      const applyUrl = job.job_apply_link || '';
      const isBlockedUrl = BLOCKED_DOMAINS.some(d => applyUrl.includes(d));
      const isBlockedEmployer = BLOCKED_DOMAINS.some(d => (job.employer_name || '').toLowerCase().includes(d));
      if (isBlockedUrl || isBlockedEmployer) continue;

      try {
        const scored = await scoreJob(job);
        if (scored.score >= MIN_SCORE) {
          results.push({
            id: String(Date.now() + Math.random()),
            title: job.job_title,
            company: job.employer_name,
            location: `${job.job_city || ''} ${job.job_state || ''}`.trim(),
            listing: job.job_description,
            apply_url: applyUrl,
            score: scored.score,
            resume_used: scored.bestResume,
            feedback: scored.feedback,
            keywords: { matches: scored.matchedKeywords || [], missing: scored.missingKeywords || [] },
            status: 'new',
            added_at: new Date().toISOString(),
            notes: '',
            source: job.job_source || 'auto',
          });
        }
        await new Promise(r => setTimeout(r, 500));
      } catch(err) {
        console.error('Score error:', err.message);
      }
    }
  }

  if (results.length > 0) {
    const { error } = await db.from('jobs').upsert(results);
    if (error) console.error('Supabase error:', error);
  }

  return res.status(200).json({ message: `Done. ${results.length} jobs saved.` });
}