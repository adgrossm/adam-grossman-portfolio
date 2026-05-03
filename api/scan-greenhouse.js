// /api/scan-greenhouse.js
// Greenhouse ATS scanner. Pulls from public board API, applies shared gate logic,
// scores via Anthropic, and ingests to Supabase.

import { isRelevantTitle, isAllowedLocation, evaluateContentGates } from './lib/jcc-gate.js';
import { scoreJob, ingestJob, logGateEvent } from './lib/jcc-score.js';

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
const ATS = 'greenhouse';
const SCANNER = 'greenhouse';

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
    console.log(`[GH-${batch}] Scanning ${company.name}...`);
    let jobsData;
    try {
      const apiRes = await fetch(`https://boards-api.greenhouse.io/v1/boards/${company.slug}/jobs`);
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
      .filter(j => isAllowedLocation(j.location?.name || '', j.title))
      .map(j => ({
        title: j.title,
        url: j.absolute_url,
        location: j.location?.name || '',
        id: j.id
      }));

    results.found += jobs.length;

    for (const job of jobs) {
      let jobDetail;
      try {
        const detailRes = await fetch(`https://boards-api.greenhouse.io/v1/boards/${company.slug}/jobs/${job.id}`);
        if (!detailRes.ok) continue;
        jobDetail = await detailRes.json();
      } catch (err) { continue; }

      const listing = (jobDetail.content || '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 6000);
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
