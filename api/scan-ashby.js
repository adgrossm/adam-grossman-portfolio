// api/scan-ashby.js
// Scans Ashby ATS company career pages using Ashby's public API
// Uses batch parameter: /api/scan-ashby?batch=1
// Finds relevant roles, scores them, pushes 68%+ to JCC pipeline

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const BASE_URL = 'https://adam-grossman-portfolio.vercel.app';

const ROLE_KEYWORDS = [
  'implementation', 'onboarding', 'customer success', 'program manager',
  'project manager', 'engagement manager', 'delivery manager',
  'delivery consultant', 'operations manager', 'enablement manager',
  'account manager', 'client success', 'solutions consultant',
  'technical account', 'partner success', 'csm', 'client partner',
  'client onboarding', 'professional services manager', 'success manager'
];

const TITLE_EXCLUSIONS = [
  'manager, customer success',
  'manager, account',
  'manager, implementation',
  'manager, onboarding',
  'manager, solutions',
  'manager, relationship',
  'director of customer success',
  'director of cs',
  'director, customer success',
  'head of customer success',
  'vp of customer success',
  'vp, customer success',
];

const ALL_COMPANIES = [
  { name: 'Deel', slug: 'Deel' },
  { name: 'Ramp', slug: 'ramp' },
  { name: 'Retool', slug: 'retool' },
  { name: 'Webflow', slug: 'webflow' },
  { name: 'Vanta', slug: 'vanta' },
  { name: 'Drata', slug: 'drata' },
  { name: 'Ironclad', slug: 'ironclad' },
  { name: 'Glean', slug: 'glean' },
  { name: 'Writer', slug: 'writer' },
  { name: 'Guru', slug: 'getguru' },
  { name: 'Chargebee', slug: 'chargebee' },
  { name: 'Paddle', slug: 'Paddle' },
  { name: 'Mercury', slug: 'mercury' },
  { name: 'OpenAI', slug: 'openai' },
  { name: 'Anthropic', slug: 'anthropic' },
  { name: 'Linear', slug: 'linear' },
  { name: 'Notion', slug: 'notion' },
  { name: 'Figma', slug: 'figma' },
  { name: 'Loom', slug: 'loom' },
  { name: 'Airtable', slug: 'airtable' },
];

const BATCH_SIZE = 2;

const ADAM_PROFILE = `You are an expert job fit analyst evaluating roles for Adam Grossman, an implementation manager and program manager based in Fort Mill, SC (Charlotte metro). Your job is to score the role, identify the best resume, and give a clear pursue or skip signal. Be brutally honest. Do not inflate scores.

ADAM'S BACKGROUND:
15+ years in Customer Success, ERP/SaaS Implementation, and Project Management. His entire career has been client-facing. He has owned executive stakeholder relationships, run QBRs, managed approximately 30 active accounts at peak portfolio (58 cumulative across 4.5 years), achieved NPS of 85, maintained 96% logo retention with only 2 churn events, grown portfolio ARR from $1.7M to $2.4M, achieved 108% average annual NRR, and delivered $8M+ in total program value across implementations, upgrades, mobile platform, and recurring services. Led 16 Odoo ERP implementations end-to-end averaging $75K each, plus 20 upgrade engagements averaging $60K each ($1.2M upgrade program value). Odoo client base was approximately 50% manufacturing customers. Built company first implementation SOPs, sprint frameworks, and delivery playbooks from scratch. Reduced average implementation timelines 30%. Reduced post-go-live issues 20%. 15+ at-risk implementation rescues with 8 converted to active reference customers. Also served as PM on UCP, a NIST-aligned law enforcement mobile platform deployed to 10 agencies across 6 states with 3,000 active officer licenses. Earlier career: grew Google account from $120K to $2M annually at Modicum. Strong in Jira, Confluence, Salesforce, HubSpot, Monday.com, MS Project, SharePoint, Google Workspace. Certifications: PSM I earned, PMP in progress. No experience in insurance P&C, healthcare clinical, legal, banking, AEC, aviation, government with clearance. Can talk technical language but is not a developer.

COMPENSATION FLOORS:
- Remote standard: $110K base or $130K OTE floor
- Remote senior: $120K base or $140K OTE floor
- Hybrid/onsite Charlotte: $120K base floor
- Hybrid/onsite outside Charlotte: $125K base floor
- No comp listed: flag neutral, do not penalize

HARD DISQUALIFIERS (cap at 50, skip):
- Industry depth Adam lacks: insurance P&C, pharma, legal, healthcare clinical, AEC, aviation, government with clearance, banking infrastructure, data center hardware
- Security clearance required
- Quota-carrying sales as core function
- Deep technical coding beyond conversational fluency
- SAP, Workday, or ServiceNow depth/certification required
- Developer AI infrastructure (LangChain, RAG, vector DBs) as core requirement
- Comp below floor after location adjustment
- Non-English language fluency required
- Commission-only comp
- Role is primarily managing a team of ICs (e.g. Manager of Customer Success, Manager of Implementation, Director of CS) where the core function is people management, hiring, coaching, and team performance rather than direct client delivery

SCORE DISTRIBUTION:
- 85-100: Rare. Apply immediately.
- 75-84: Strong match. Tailor resume and apply.
- 65-74: Reasonable fit. Apply if pipeline is thin.
- 55-64: Significant issues. Proceed with caution.
- Below 55: Skip.`;

const foreignLanguage = /must speak german|must speak french|must speak spanish|must speak portuguese|must speak japanese|must speak korean|must speak mandarin|german speaking|french speaking|portuguese speaking|korean speaking|japanese speaking/i.test(listing);
if (foreignLanguage) {
  results.details.push({ title: job.title, company: company.name, score: 0, location: job.location, url: job.url, skipped: 'foreign language required' });
  results.skipped++;
  continue;
}

function isRelevantTitle(title) {
  const lower = title.toLowerCase();
  if (TITLE_EXCLUSIONS.some(ex => lower.includes(ex))) return false;
  return ROLE_KEYWORDS.some(kw => lower.includes(kw));
}

async function scoreJob(title, company, listing) {
  const prompt = `${ADAM_PROFILE}

JOB LISTING:
${listing.slice(0, 4000)}

Respond ONLY with valid JSON, no other text:
{
  "score": 72,
  "bestResume": "PM",
  "feedback": "4 to 5 sentence honest assessment. Be direct. No filler.",
  "hardDisqualifiers": [],
  "strengths": ["specific strength that matches"],
  "addToResume": ["skill to make explicit before applying"],
  "trueGaps": ["genuine skill gap"]
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

async function ingestJob(title, company, listing, scoreData, applyUrl, location) {
  try {
    const res = await fetch(`${BASE_URL}/api/ingest-job`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ANTHROPIC_API_KEY}`,
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
      })
    });
    return await res.json();
  } catch (err) {
    console.error(`Ingest failed: ${title} at ${company}`, err.message);
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const batch = parseInt(req.query.batch || '1');
  const start = (batch - 1) * BATCH_SIZE;
  const COMPANIES = ALL_COMPANIES.slice(start, start + BATCH_SIZE);
  const totalBatches = Math.ceil(ALL_COMPANIES.length / BATCH_SIZE);

  if (COMPANIES.length === 0) {
    return res.status(200).json({ error: `Batch ${batch} is out of range. Total batches: ${totalBatches}` });
  }

  const results = { scanner: 'ashby', batch, totalBatches, companies: COMPANIES.map(c => c.name), scanned: 0, found: 0, scored: 0, ingested: 0, skipped: 0, duplicates: 0, details: [] };

  for (const company of COMPANIES) {
    console.log(`[AS-${batch}] Scanning ${company.name}...`);
    let jobsData;
    try {
      const apiRes = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${company.slug}`);
      if (!apiRes.ok) { results.details.push({ company: company.name, status: 'fetch_failed' }); continue; }
      jobsData = await apiRes.json();
      console.log(`[AS-${batch}] ${company.name}: API returned ${jobsData.jobs?.length || 0} total jobs`);
    } catch (err) {
      results.details.push({ company: company.name, status: 'fetch_failed' });
      continue;
    }
    results.scanned++;

    const jobs = (jobsData.jobs || [])
      .filter(j => isRelevantTitle(j.title))
      .filter(j => {
  if (j.isRemote || j.workplaceType === 'Remote') return true;
  const loc = (j.location || '').toLowerCase();
  if (loc.includes('charlotte') || loc.includes(', nc')) return true;
if (loc.includes('dallas') || loc.includes(', tx')) return true;
  // Block international regions and countries
  const blocked = ['emea', 'latam', 'apac', 'australia', 'mexico', 'canada', 'south africa', 'ireland', 'uk', 'poland', 'spain', 'netherlands', 'germany', 'france', 'india', 'singapore', 'japan', 'korea', 'brazil', 'colombia', 'peru', 'chile'];
  if (blocked.some(b => loc.includes(b))) return false;
  const country = j.address?.addressCountry || '';
  if (country && country !== 'USA' && country !== 'US' && country !== 'United States') return false;
  return true;
})
      .map(j => ({
        title: j.title,
        url: j.jobUrl || j.applyUrl || '',
        location: j.location || '',
        description: j.descriptionPlain || '',
        isRemote: j.isRemote || j.workplaceType === 'Remote'
      }));

    console.log(`[AS-${batch}] ${company.name}: ${jobs.length} relevant roles after filtering`);
    results.found += jobs.length;

    for (const job of jobs) {
      const listing = (job.description || '').slice(0, 6000);
      if (listing.length < 200) continue;

      // Additional remote check on JD content for non-remote flagged roles
      if (!job.isRemote) {
        const hasRemote = /remote|work from home|distributed|anywhere in the (us|united states)/i.test(listing);
        const isLocal = /charlotte|fort mill|, nc|dallas|, tx/i.test(job.location);
if (!hasRemote && !isLocal) {
          results.details.push({ title: job.title, company: company.name, score: 0, location: job.location, url: job.url, skipped: 'onsite only' });
          results.skipped++;
          continue;
        }
      }

      const foreignLanguage = /must speak german|must speak french|must speak spanish|must speak portuguese|must speak japanese|must speak korean|must speak mandarin|german speaking|french speaking|portuguese speaking|korean speaking|japanese speaking/i.test(listing);
if (foreignLanguage) {
  results.details.push({ title: job.title, company: company.name, score: 0, location: job.location, url: job.url, skipped: 'foreign language required' });
  results.skipped++;
  continue;
}

      const scoreData = await scoreJob(job.title, company.name, listing);
      if (!scoreData) continue;
      results.scored++;

      console.log(`[AS-${batch}] ${job.title} at ${company.name}: ${scoreData.score}%`);
      results.details.push({ title: job.title, company: company.name, score: scoreData.score, location: job.location, url: job.url });

      if (scoreData.score >= 68) {
        const r = await ingestJob(job.title, company.name, listing, scoreData, job.url, job.location);
        if (r?.status === 'success') results.ingested++;
        else if (r?.status === 'duplicate') results.duplicates++;
        else results.skipped++;
      } else {
        results.skipped++;
      }

      await new Promise(r => setTimeout(r, 500));
    }
  }

  return res.status(200).json(results);
}
