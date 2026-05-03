// /api/scan-lever.js
// Lever ATS scanner. Pulls from public posting API, applies shared gate logic,
// scores via Anthropic, and ingests to Supabase.

import { isRelevantTitle, isAllowedLocation, evaluateContentGates } from './lib/jcc-gate.js';
import { scoreJob, ingestJob, logGateEvent } from './lib/jcc-score.js';

const ALL_COMPANIES = [
  { name: 'TrustArc', slug: 'trustarc' },
  { name: 'Outreach', slug: 'outreach' },
  { name: 'Contentsquare', slug: 'contentsquare' },
  { name: 'SafetyCulture', slug: 'safetyculture-2' },
  { name: 'Sitetracker', slug: 'sitetracker' },
  { name: 'Lever', slug: 'lever' },
  { name: 'BlackCloak', slug: 'BlackCloak' },
  { name: 'Windfall', slug: 'windfalldata' },
  { name: 'Eve', slug: 'Eve' },
  { name: 'Canary Technologies', slug: 'canarytechnologies' },
  { name: 'Owner', slug: 'owner' },
  { name: 'H1', slug: 'h1' },
  { name: 'Color', slug: 'color' },
  { name: 'NimbleRx', slug: 'nimblerx' },
  { name: 'Seismic', slug: 'seismic' },
  { name: 'Demandbase', slug: 'demandbase' },
  { name: 'Clari', slug: 'clari' },
  { name: 'Iterable', slug: 'iterable' },
  { name: 'Productboard', slug: 'productboard' },
  { name: 'Sendbird', slug: 'sendbird' },
];

const BATCH_SIZE = 5;
const ATS = 'lever';
const SCANNER = 'lever';

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
    console.log(`[LV-${batch}] Scanning ${company.name}...`);
    let postings;
    try {
      const apiRes = await fetch(`https://api.lever.co/v0/postings/${company.slug}`);
      if (!apiRes.ok) {
        results.details.push({ company: company.name, status: 'fetch_failed' });
        continue;
      }
      postings = await apiRes.json();
    } catch (err) {
      results.details.push({ company: company.name, status: 'fetch_failed' });
      continue;
    }
    results.scanned++;

    const jobs = (postings || [])
      .filter(j => isRelevantTitle(j.text))
      .filter(j => isAllowedLocation(j.categories?.location || '', j.text))
      .map(j => ({
        title: j.text,
        url: j.hostedUrl,
        location: j.categories?.location || '',
        description: j.descriptionPlain || ''
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
