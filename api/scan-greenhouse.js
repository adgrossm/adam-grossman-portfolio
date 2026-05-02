// api/scan-greenhouse.js
// Scans 30 Greenhouse ATS company career pages
// Runs at 6am ET daily
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
  { name: 'Workato', slug: 'workato' },
  { name: 'Intercom', slug: 'intercom' },
  { name: 'HubSpot', slug: 'hubspotjobs' },
  { name: 'Asana', slug: 'asana' },
  { name: 'Gusto', slug: 'gusto' },
  { name: 'Salesloft', slug: 'salesloft' },
  { name: 'Klaviyo', slug: 'klaviyo' },
  { name: 'Amplitude', slug: 'amplitude' },
  { name: 'Mixpanel', slug: 'mixpanel' },
  { name: 'Calendly', slug: 'calendly' },
  { name: 'PagerDuty', slug: 'pagerduty' },
  { name: 'Hightouch', slug: 'hightouch' },
  { name: 'Samsara', slug: 'samsara' },
  { name: 'Lattice', slug: 'lattice' },
  { name: 'Culture Amp', slug: 'cultureamp' },
  { name: 'Contentful', slug: 'contentful' },
  { name: 'LaunchDarkly', slug: 'launchdarkly' },
  { name: 'Okta', slug: 'okta' },
  { name: 'Datadog', slug: 'datadog' },
  { name: 'Dialpad', slug: 'dialpad' },
  { name: 'Airtable', slug: 'airtable' },
  { name: 'Justworks', slug: 'justworks' },
  { name: 'Carta', slug: 'carta' },
  { name: 'GitLab', slug: 'gitlab' },
  { name: 'ServiceTitan', slug: 'servicetitan' },
  { name: 'Coupa', slug: 'coupa' },
  { name: 'Cloudflare', slug: 'cloudflare' },
  { name: 'Postman', slug: 'postman' },
  { name: 'New Relic', slug: 'newrelic' },
  { name: 'Grafana Labs', slug: 'grafanalabs' },
];

const BATCH_SIZE = 5;

const ADAM_PROFILE = `You are an expert job fit analyst evaluating roles for Adam Grossman, an implementation manager and program manager based in Fort Mill, SC (Charlotte metro). Your job is to score the role, identify the best resume, and give a clear pursue or skip signal. Be brutally honest. Do not inflate scores.

ADAM'S BACKGROUND:
15+ years in Customer Success, ERP/SaaS Implementation, and Project Management. His entire career has been client-facing. He has owned executive stakeholder relationships, run QBRs, managed ~30 active accounts at peak portfolio (58 cumulative across 4.5 years), achieved NPS of 85, maintained 96% logo retention with only 2 churn events, grown portfolio ARR from $1.7M to $2.4M, achieved 108% average annual NRR, and delivered $8M+ in total program value across implementations, upgrades, mobile platform, and recurring services. Led 16 Odoo ERP implementations end-to-end averaging $75K each, plus 20 upgrade engagements averaging $60K each ($1.2M upgrade program value). Coined Supported Version Rate (SVR) as a SaaS metric and trademarked Upgrade as a Service (UaaS), U.S. Trademark Serial No. 99691790.

CONFIANZ CLIENT BASE COMPOSITION:
- ~50% manufacturing ERP customers (approximately 29 of 58 clients)
- Additional clients spanned distribution, wholesale trade, professional services, nonprofit, and retail
- Manufacturing ERP is a STRENGTH and BOOST signal, never a disqualifier
- Apply boost when roles target manufacturing, distribution, wholesale, supply chain, retail, or industrial software verticals

CONFIANZ FRAMEWORK & DELIVERY METRICS:
- Built company first implementation SOPs, sprint frameworks, and delivery playbooks from scratch
- Reduced average implementation timelines 30% (from 6-7 months down to 4-5 months)
- Reduced post-go-live issues 20%
- 15+ at-risk implementation rescues with 8 converted to active reference customers
- 5,000+ documented client interactions over 4.5 years
- ~60 direct stakeholder relationships at C-suite level
- Directed cross-functional teams of 6-8 specialists per engagement (developers, QA, tech lead, IT infrastructure)
- Coordinated 75+ global Product, Engineering, and Delivery resources

UCP MOBILE PLATFORM EXPERIENCE:
Served as PM on UCP, a NIST-aligned law enforcement mobile platform. MVP in 3 months with 4 devs + 1 QA, 2-week Agile sprints in Jira. Deployed to 10 agencies across 6 states (MI, WI, PA, GA, SC, NC), ~3,000 active officer licenses, 5,000-6,000 total downloads. Led 20-25 core releases. Won Gold and Silver American Business Awards. Platform alerts contributed to confirmed arrests. Managed Apple/Google app store submissions.

EARLIER CAREER:
Senior Account Manager at Modicum (ProPoint Graphics) 2008-2016: grew Google account from $120K to $2M annually (16x growth) over 3 years spanning 80+ Google divisions and 100+ stakeholder relationships. Led inaugural Google for India event program (December 2015, attended by CEO Sundar Pichai). Managed enterprise accounts including LG, Sharp, YouTube, IAB. Founded Simply Creative Group 2016-2019 with 100% on-time delivery. Account Manager at Phase 3 Marketing 2019-2020.

TOOLS & METHODOLOGIES:
Strong in Jira (advanced), Confluence, Salesforce, HubSpot, Monday.com, MS Project, SharePoint, Google Workspace, Azure DevOps. Methodologies: Waterfall for ERP, Agile/Scrum for mobile work. AI tools used extensively across SOPs, frameworks, scorecards, and process optimization as a power user.

CERTIFICATIONS:
- PSM I earned (Scrum.org)
- PMP in progress
- LinkedIn Learning Agile Foundations
- Lean Six Sigma Yellow Belt modules
- Atlassian Agile Project Management certificate
- Full Stack Web Development Certificate from UNC Charlotte

NO EXPERIENCE IN: insurance P&C, healthcare clinical, legal, banking/capital markets infrastructure, AEC/construction, aviation operations, government with security clearance, data center hardware, ServiceNow-specific implementation. Can talk technical language but is not a developer. Does not have hands-on experience with developer AI infrastructure (LangChain, RAG, vector DBs, agent frameworks).

TARGET ROLES: Implementation Manager, Senior Implementation Manager, Delivery Manager, Delivery Consultant, Program Manager, Senior Program Manager, Engagement Manager, Customer Success Manager, Senior CSM, Onboarding Manager, Operations Manager, Enablement Manager. Title matters less than what the job actually requires day to day.

COMPENSATION FLOORS (UPDATED):
- Remote CSM/Implementation/PM (standard): $110K base or $130K OTE floor
- Remote Senior/Enterprise level: $120K base or $140K OTE floor  
- Hybrid/onsite Charlotte metro or Dallas TX: $120K base floor
- Hybrid/onsite outside Charlotte: $125K base floor
- CSM with variable comp: $130-145K OTE target range
- If posted comp range tops out at or below floor, recommend skip even with strong functional fit
- If no compensation listed, flag as neutral, do not penalize
- Anchor to middle of posted range, never the floor

HARD DISQUALIFIERS (cap score at 50, recommend skip):
- Role requires specific industry depth Adam lacks: insurance P&C, pharma, legal services, healthcare clinical, AEC/construction, aviation operations, government with security clearance, banking/capital markets infrastructure, data center hardware
- Role requires security clearance
- Role is primarily quota-carrying sales with revenue targets as core function
- Role requires deep technical coding or engineering beyond conversational fluency
- Role requires SAP, Workday, or ServiceNow-specific implementation depth/certification
- Role requires hands-on developer AI infrastructure (LangChain, RAG pipelines, vector databases, agentic AI frameworks) as core requirement
- Compensation clearly and non-negotiably below floor after location adjustment
- Role requires non-English language fluency
- Commission-only compensation structure
- Role is primarily managing a team of ICs (e.g. Manager of Customer Success, Manager of Implementation, Director of CS) where the core function is people management, hiring, coaching, and team performance rather than direct client delivery

SOFT PENALTIES (deduct 10-15 points, do not auto-skip):
Apply when role's primary differentiator is a specific domain advisory capability Adam lacks. Even when role is otherwise functional fit, screening dynamics filter non-vertical candidates before capability is evaluated:
- E-commerce marketing strategy advisor (SMS, email, conversion optimization, abandoned cart, segmentation)
- Healthcare/telehealth domain navigation (HIPAA, payer/provider/patient terminology)
- Marketing automation strategy beyond standard CSM motion mechanics
- Vertical-specific operational consulting requiring industry workflow fluency
- Developer-as-primary-customer (DevOps tooling, infrastructure platforms where CSM advises engineers)

OVERQUALIFICATION RULE:
If role targets 3-7 years experience and Adam has 15+, deduct 10-15 points and flag. Overqualified candidates get screened out.

TOOLS AND PLATFORMS:
Individual tool gaps are not hard disqualifiers. Tools are learnable. Only flag as hard disqualifier if entire technical domain is foreign. Gainsight, Totango, ChurnZero, Planhat, and similar CS platforms are bridgeable. AI productivity tools (ChatGPT, Claude, Notion AI, Copilot) are fine and are demonstrated strengths. Developer AI tools (LangChain, vector DBs, RAG, agent frameworks) are not bridgeable.

BRIDGEABLE GAPS (flag but do not disqualify):
- People management with direct reports: Adam lacks formal direct report management experience
- Consulting pedigree gap: roles at firms like Deloitte, Accenture, KPMG represent a soft gap; frame Confianz delivery work as consultant-style client-facing engagement
- Capex/budget variance framing: Adam's experience is ARR and invoicing based, not capital budget management
- SharePoint/PowerPoint not explicitly named in skills but used in practice
- Specific CS platform tools (Gainsight, Totango) not used at Confianz but rapidly learnable

BOOST SIGNALS (push scores higher when these appear together):
- Client-facing delivery ownership from initiation to closure
- Software or technical project context with SDLC language
- Relationship and expectation management as core responsibilities
- Cross-functional coordination and stakeholder communication
- Risk management, escalation handling, and post-launch stabilization
- ERP or SaaS implementation mentions
- Manufacturing, distribution, wholesale trade, retail, supply chain, or industrial software ERP context (Odoo client base was ~50% manufacturing)
- Mobile app development, testing, distribution, or end-to-end delivery
- Field service management or mobile field workforce platforms (Confianz UCP experience and Velocitor target alignment)
- Hardware-software integration delivery (relevant to field service and IoT-adjacent platforms)
- Change management and user adoption
- Agile methodologies, coaching, or impediment removal
- Creative agency experience combining account management and project management
- SOW development including time and budget specifications
- AI-assisted workflow optimization as a power user

SCORE DISTRIBUTION:
- 85 to 100: Rare. Drop everything and apply today.
- 75 to 84: Strong match. Tailor resume and apply.
- 65 to 74: Reasonable fit with notable gaps. Apply if pipeline is thin and comp clears floor.
- 55 to 64: Significant issues. Proceed with caution. Skip unless pipeline is critically thin.
- Below 55: Hard disqualifier or fundamental mismatch. Skip.

LOCKED METRICS (use these exact numbers in any output):
- $8M+ total program value across 4.5 years at Confianz
- 16 original ERP implementations averaging $75K each
- 20 upgrade engagements averaging $60K each ($1.2M upgrade program)
- Portfolio ARR grew from $1.7M to $2.4M
- 96% logo retention across 58 clients with 2 churn events
- 108% average annual NRR
- ~$700K cumulative expansion ARR
- 30% implementation timeline reduction (6-7 months to 4-5 months)
- 20% post-go-live issue reduction
- 15+ at-risk implementation rescues, 8 converted to reference customers
- 5,000+ documented client interactions
- ~60 direct stakeholder relationships
- 6 specialists per engagement
- 75+ global resources coordinated
- NPS of 85
- UCP: 10 agencies, 6 states, 3,000 officer licenses, 20-25 core releases`;

function isAllowedLocation(location) {
  if (!location) return true;
  const loc = location.toLowerCase();
  if (loc.includes('remote')) return true;
  if (loc.includes('united states')) return true;
  if (loc.includes('charlotte') || loc.includes(', nc')) return true;
if (loc.includes('dallas') || loc.includes(', tx')) return true;
  const international = [
    'ireland', 'dublin', 'london', 'uk', 'united kingdom', 'australia',
    'singapore', 'india', 'germany', 'france', 'spain', 'netherlands',
    'canada', 'mexico', 'brazil', 'japan', 'korea', 'israel',
    'portugal', 'italy', 'sweden', 'denmark', 'norway', 'poland',
    'philippines', 'indonesia', 'malaysia', 'thailand', 'vietnam',
    'taiwan', 'hong kong', 'china', 'turkey', 'argentina',
    'colombia', 'czech', 'romania', 'new zealand', 'europe'
  ];
  if (international.some(c => loc.includes(c))) return false;
  return true;
}

function isRelevantTitle(title) {
  const lower = title.toLowerCase();
  if (TITLE_EXCLUSIONS.some(ex => lower.includes(ex))) return false;
  return ROLE_KEYWORDS.some(kw => lower.includes(kw));
}

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; JobScanner/1.0)' }
    });
    if (!res.ok) return null;
    return await res.text();
  } catch (err) {
    console.error(`Fetch failed: ${url}`, err.message);
    return null;
  }
}

function extractJobs(html) {
  const jobs = [];
  const regex = /\[([^\]]+)\]\((https?:\/\/(?:job-boards|boards)\.greenhouse\.io\/[^/]+\/jobs\/\d+[^)]*)\)/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const rawTitle = match[1].trim();
    const url = match[2].split('?')[0];
    const parts = rawTitle.split(/\s{2,}/);
    const title = parts[0].trim();
    const location = parts[1] ? parts[1].trim() : '';
    if (title && url && isRelevantTitle(title) && isAllowedLocation(location)) {
      jobs.push({ title, url, location });
    }
  }
  return jobs.filter((j, i, a) => a.findIndex(x => x.url === j.url) === i);
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 6000);
}

const foreignLanguage = /must speak german|must speak french|must speak spanish|must speak portuguese|must speak japanese|must speak korean|must speak mandarin|german speaking|french speaking|portuguese speaking|korean speaking|japanese speaking/i.test(listing);
if (foreignLanguage) {
  results.details.push({ title: job.title, company: company.name, score: 0, location: job.location, url: job.url, skipped: 'foreign language required' });
  results.skipped++;
  continue;
}

async function scoreJob(title, company, listing) {
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

  const results = { scanner: 'greenhouse', batch, totalBatches, companies: COMPANIES.map(c => c.name), scanned: 0, found: 0, scored: 0, ingested: 0, skipped: 0, duplicates: 0, details: [] };

  for (const company of COMPANIES) {
    console.log(`[GH-${batch}] Scanning ${company.name}...`);
    let jobsData;
    try {
      const apiRes = await fetch(`https://boards-api.greenhouse.io/v1/boards/${company.slug}/jobs`);
      if (!apiRes.ok) { results.details.push({ company: company.name, status: 'fetch_failed' }); continue; }
      jobsData = await apiRes.json();
      console.log(`[GH-${batch}] ${company.name}: API returned ${jobsData.jobs?.length || 0} total jobs`);
    } catch (err) {
      results.details.push({ company: company.name, status: 'fetch_failed' });
      continue;
    }
    results.scanned++;

    const jobs = (jobsData.jobs || [])
      .filter(j => isRelevantTitle(j.title))
      .filter(j => isAllowedLocation(j.location?.name || ''))
      .map(j => ({
        title: j.title,
        url: j.absolute_url,
        location: j.location?.name || '',
        id: j.id
      }));

    console.log(`[GH-${batch}] ${company.name}: ${jobs.length} relevant roles after filtering`);
    results.found += jobs.length;

    for (const job of jobs) {
      let jobDetail;
      try {
        const detailRes = await fetch(`https://boards-api.greenhouse.io/v1/boards/${company.slug}/jobs/${job.id}`);
        if (!detailRes.ok) continue;
        jobDetail = await detailRes.json();
      } catch (err) { continue; }
      const listing = (jobDetail.content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 6000);
if (listing.length < 200) continue;

const hasRemote = /remote|work from home|distributed|anywhere in the (us|united states)/i.test(listing);
const isLocal = /charlotte|fort mill|, nc|dallas|, tx/i.test(job.location);
if (!hasRemote && !isLocal) {
  results.details.push({ title: job.title, company: company.name, score: 0, location: job.location, url: job.url, skipped: 'onsite only' });
  results.skipped++;
  continue;
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

      console.log(`[GH-${batch}] ${job.title} at ${company.name}: ${scoreData.score}%`);
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
