// /api/scan-ashby.js
// Ashby ATS scanner. Pulls from public job-board API, applies shared gate logic,
// scores via Anthropic, and ingests to Supabase.

import { isRelevantTitle, isAllowedLocation, evaluateContentGates } from './lib/jcc-gate.js';
import { scoreJob, ingestJob, logGateEvent } from './lib/jcc-score.js';

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
const ATS = 'ashby';
const SCANNER = 'ashby';

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

  const results = {
    scanner: SCANNER, batch, totalBatches,
    companies: COMPANIES.map(c => c.name),
    scanned: 0, found: 0, scored: 0, ingested: 0,
    skipped_hard: 0, skipped_soft: 0, duplicates: 0, details: []
  };

  for (const company of COMPANIES) {
    console.log(`[AS-${batch}] Scanning ${company.name}...`);
    let jobsData;
    try {
      const apiRes = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${company.slug}`);
      if (!apiRes.ok) {
        results.details.push({ company: company.name, status: 'fetch_failed' });
        continue;
      }
      jobsData = await apiRes.json();
    } catch (err) {
      results.details.push({ company: company.name, status: 'fetch_failed' });
      continue;
    }
    results.scanned++;

    const jobs = (jobsData.jobs || [])
      .filter(j => isRelevantTitle(j.title))
      .filter(j => {
        const isRemote = j.isRemote || j.workplaceType === 'Remote';
        const country = j.address?.addressCountry || '';
        return isAllowedLocation(j.location || '', j.title, isRemote, country);
      })
      .map(j => ({
        title: j.title,
        url: j.jobUrl || j.applyUrl || '',
        location: j.location || '',
        description: j.descriptionPlain || '',
        isRemote: j.isRemote || j.workplaceType === 'Remote'
      }));

    results.found += jobs.length;

    for (const job of jobs) {
      const listing = (job.description || '').slice(0, 6000);
      if (listing.length < 200) continue;

      // ===== CONTENT GATES =====
      const gateResult = evaluateContentGates(job, listing);
      if (!gateResult.pass) {
        if (gateResult.severity === 'soft') {
          await logGateEvent({
            title: job.title, company: company.name, location: job.location,
            applyUrl: job.url, ats: ATS, scanner: SCANNER,
            reason: gateResult.reason, severity: gateResult.severity
          });
          results.skipped_soft++;
        } else {
          results.skipped_hard++;
        }
        results.details.push({
          title: job.title, company: company.name, score: 0,
          location: job.location, url: job.url,
          skipped: gateResult.reason, severity: gateResult.severity
        });
        continue;
      }

      // ===== SCORE =====
      const scoreData = await scoreJob(job.title, company.name, listing);
      if (!scoreData) continue;
      results.scored++;

      results.details.push({
        title: job.title, company: company.name,
        score: scoreData.score, location: job.location, url: job.url
      });

      if (scoreData.score >= 68) {
        const r = await ingestJob(job.title, company.name, listing, scoreData, job.url, job.location, ATS);
        if (r?.status === 'success') results.ingested++;
        else if (r?.status === 'duplicate') results.duplicates++;
        else results.skipped_hard++;
      } else {
        results.skipped_hard++;
      }

      await new Promise(r => setTimeout(r, 500));
    }
  }

  return res.status(200).json(results);
}
