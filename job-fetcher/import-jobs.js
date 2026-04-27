const fs = require('fs');
const path = require('path');

const newJobsFile = path.join(__dirname, 'new-jobs.json');
const outputFile = path.join(__dirname, 'jobs-for-dashboard.json');

const newJobs = JSON.parse(fs.readFileSync(newJobsFile, 'utf8'));

// Format to match what the dashboard expects
const formatted = newJobs.map(job => ({
  id: job.id,
  title: job.title,
  company: job.company,
  listing: job.listing,
  score: job.score,
  status: 'new',
  resumeUsed: job.resumeUsed,
  addedAt: job.addedAt,
  feedback: job.feedback,
  keywords: job.keywords,
  notes: '',
  applyUrl: job.applyUrl || '',
  source: job.source || 'auto',
}));

fs.writeFileSync(outputFile, JSON.stringify(formatted, null, 2));
console.log(`Exported ${formatted.length} jobs to jobs-for-dashboard.json`);