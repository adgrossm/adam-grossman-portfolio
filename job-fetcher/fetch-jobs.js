const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// ── CONFIG ──────────────────────────────────────────────
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '';
const ANTHROPIC_KEY = process.env.ANTHROPIC_KEY || '';
const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID || '';
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY || '';
const SERPAPI_KEY = process.env.SERPAPI_KEY || '';

const SEARCHES = [
  'Customer Success Manager remote',
  'Implementation Manager remote',
  'Senior Project Manager SaaS remote',
  'Customer Success Manager SaaS',
  'Implementation Consultant ERP remote',
];

const LOCATION = 'United States';
const MIN_SCORE = 65;
const ALLOWED_LOCATIONS = [
  'remote',
  'charlotte',
  'fort mill',
  'indian land',
  'rock hill',
  'gastonia',
  'concord',
  'mooresville',
  'huntersville',
  'ballantyne',
];
const OUTPUT_FILE = path.join(__dirname, 'new-jobs.json');

// ── RESUMES ─────────────────────────────────────────────
const RESUMES = {
  csm: `Senior Customer Success Manager with 15+ years of experience. Skills: Customer Lifecycle & Renewal Strategy, Executive Stakeholder Engagement, Net Revenue Retention & Expansion Growth, Customer Health Monitoring, SaaS & ERP Customer Success, Risk & Escalation Management, Cross-Functional Collaboration, Executive QBRs, Data-Driven Performance Reviews, Change Management, Customer Value Realization, Voice of Customer Programs, Client Training & Enablement, Customer Success Playbooks, AI-Assisted Documentation. Tools: Jira, Confluence, Salesforce, HubSpot, Monday.com, Zoho. Experience: Grew portfolio ARR from $1.7M to $2.4M achieving 108% NRR. 95% logo retention across 58 clients. $700K expansion ARR. Built first CS framework with playbooks, health scoring, renewal forecasting. NPS of 85.`,

  pm: `Program & Project Manager with 15+ years. Skills: Project Planning & Scheduling, Requirements Gathering, Quality Assurance, Risk Identification & Mitigation, SDLC, Change Control & Scope Management, Cross-Functional Team Collaboration, Executive Stakeholder Alignment, Delivery Governance, Agile & Waterfall, Sprint Planning & Backlog Management, Compliance-Aware Project Execution. Tools: Jira, Confluence, Salesforce, HubSpot, Monday.com, Microsoft Project. Certifications: PSM I, PMP In Progress. Experience: $6M+ total program value across 16 ERP implementations. Led 75+ global resources. Reduced implementation timelines by 40%.`,

  impl: `Implementation Project Manager with 4.5 years ERP/SaaS implementation experience and 15+ years project management. Skills: ERP Implementation Lifecycle, Client Onboarding & Go-Live Execution, SOP & Delivery Framework Development, Agile Sprint Planning, SDLC, Cross-Functional Team Leadership, Jira-Based Project Management, Requirements Gathering, Risk Identification, Executive Stakeholder Communication, UAT Coordination & QA Oversight, Change Management & User Adoption, Post-Launch Stabilization. Experience: 16 Odoo ERP implementations averaging $75K each. Rebuilt 15+ at-risk implementations. Built company's first implementation SOPs. Reduced timelines 40%, cut post-go-live issues 20%.`
};

// ── FETCH JOBS FROM JSEARCH ──────────────────────────────
async function fetchJobs(query) {
  const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query + ' in ' + LOCATION)}&page=1&num_pages=1&date_posted=3days&country=us`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'jsearch.p.rapidapi.com',
      'x-rapidapi-key': RAPIDAPI_KEY,
    }
  });

  const data = await res.json();
  return (data.data || []).map(job => ({ ...job, job_source: 'jsearch' }));
}

// ----FETCH JOBS FROM ADZUNA API--------------------------------------
async function fetchAdzunaJobs(query) {
  const encoded = encodeURIComponent(query);
  const url = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=10&what=${encoded}&max_days_old=3`;

  try {
    const res = await fetch(url);
    const text = await res.text();
    const data = JSON.parse(text);
    
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
    console.log(`  Adzuna error: ${err.message}`);
    return [];
  }
}

// ---------FETCH JOBS FROM INDEED API USING SERP API -------------------------------
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
      job_apply_link: job.link || job.related_links?.[0]?.link || '',
      job_source: 'indeed',
    }));
  } catch(err) {
    console.log(`  Indeed/SerpApi error: ${err.message}`);
    return [];
  }
}


// ── SCORE A JOB AGAINST ALL RESUMES ─────────────────────
async function scoreJob(job) {
  const listing = `
Job Title: ${job.job_title}
Company: ${job.employer_name}
Location: ${job.job_city}, ${job.job_state}
Description: ${job.job_description?.slice(0, 3000)}
  `.trim();

  const prompt = `You are a career coach. Score this job listing against Adam Grossman's three resumes and pick the best match.

JOB LISTING:
${listing}

CSM RESUME: ${RESUMES.csm}

PM RESUME: ${RESUMES.pm}

IMPLEMENTATION RESUME: ${RESUMES.impl}

Respond ONLY with valid JSON, no other text:
{
  "score": 82,
  "bestResume": "CSM",
  "feedback": "2-3 sentence analysis of fit and what to emphasize",
  "matchedKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "missingKeywords": ["missing1", "missing2", "missing3"]
}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const data = await res.json();
  const text = data.content?.[0]?.text || '{}';
  const clean = text.replace(/```json\n?|```\n?/g, '').trim();
  return JSON.parse(clean);
}

// ── MAIN ─────────────────────────────────────────────────
async function main() {
  console.log('Starting job fetch...\n');

  const seen = new Set();
  const results = [];

for (const query of SEARCHES) {
    console.log(`Searching JSearch: ${query}`);
    const jsearchJobs = (await fetchJobs(query)).map(j => ({ ...j, job_source: 'jsearch' }));
console.log(`  JSearch found ${jsearchJobs.length} listings`);

console.log(`Searching Adzuna: ${query}`);
const adzunaJobs = (await fetchAdzunaJobs(query)).map(j => ({ ...j, job_source: 'adzuna' }));
console.log(`  Adzuna found ${adzunaJobs.length} listings`);

const indeedJobs = (await fetchIndeedJobs(query)).map(j => ({ ...j, job_source: 'indeed' }));
console.log(`  Indeed found ${indeedJobs.length} listings`);
const jobs = [...adzunaJobs, ...indeedJobs];

    for (const job of jobs) {
      // Skip duplicates
      if (seen.has(job.job_id)) continue;
      seen.add(job.job_id);

      // Skip jobs without descriptions
      if (!job.job_description || job.job_description.length < 100) continue;
      const locationText = `${job.job_city || ''} ${job.job_state || ''} ${job.job_is_remote ? 'remote' : ''}`.toLowerCase();
const titleAndDesc = `${job.job_title || ''} ${job.job_description?.slice(0, 500) || ''}`.toLowerCase();
const isRemote = job.job_is_remote || titleAndDesc.includes('remote') || locationText.includes('remote');
const isAllowed = isRemote || ALLOWED_LOCATIONS.some(loc => locationText.includes(loc));
if (!isAllowed) {
  console.log(`  Skipping (location): ${job.job_title} at ${job.employer_name} — ${job.job_city}, ${job.job_state}`);
  continue;
}
const BLOCKED_DOMAINS = ['jobleads', 'jobgether', 'jooble', 'talent.com', 'jobrapido', 'hireza', 'hirevector', 'careerly', 'jobflarely', 'whatjobs', 'bebee', 'asobbi', 'learn4good', 'dynamitejobs', 'synamitejobs', 'up2staff', 'dailyremote'];
const isBlockedEmployer = BLOCKED_DOMAINS.some(d => (job.employer_name || '').toLowerCase().includes(d));
if (isBlockedEmployer) {
  console.log(`  Skipping (blocked employer): ${job.job_title} at ${job.employer_name}`);
  continue;
}
const applyUrl = job.job_apply_link || '';
const isBlockedSource = BLOCKED_DOMAINS.some(d => applyUrl.includes(d));
if (isBlockedSource) {
  console.log(`  Skipping (redirector): ${job.job_title} at ${job.employer_name} — ${applyUrl}`);
  continue;
}

      process.stdout.write(`  Scoring: ${job.job_title} at ${job.employer_name}...`);

      try {
        const scored = await scoreJob(job);

        if (scored.score >= MIN_SCORE) {
          results.push({
            id: Date.now() + Math.random(),
            title: job.job_title,
            company: job.employer_name,
            location: `${job.job_city || ''}, ${job.job_state || ''}`.trim(),
            listing: job.job_description,
            applyUrl: job.job_apply_link,
            score: scored.score,
            resumeUsed: scored.bestResume,
            feedback: scored.feedback,
            keywords: {
              matches: scored.matchedKeywords || [],
              missing: scored.missingKeywords || []
            },
            status: 'new',
            addedAt: new Date().toISOString(),
            notes: '',
            source: String(job.job_source || 'auto'),
          });
          console.log(` ${scored.score}% ✓`);
        } else {
          console.log(` ${scored.score}% (below threshold, skipped)`);
        }

        // Small delay to avoid rate limits
        await new Promise(r => setTimeout(r, 500));

      } catch (err) {
        console.log(` ERROR: ${err.message}`);
      }
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
  console.log(`\nDone. ${results.length} jobs above ${MIN_SCORE}% saved to new-jobs.json`);
}

main().catch(console.error);