# JCC Supabase Security Refactor

## Context

This is the Job Command Center (JCC) at `adam-grossman-portfolio.vercel.app/job-command-center2.html`. It's a single user pipeline tracker that currently talks directly to Supabase from the browser using a publishable key. That key is visible in DevTools, which means anyone hitting the site can read, write, or delete every row in the `jobs` table.

The fix is to route all DB and storage operations through Vercel serverless functions using the Supabase service role key, then drop the wide open RLS policies. The frontend never touches Supabase directly again.

## Stack and conventions

- Vercel deployment. Serverless functions live in `/api/` at the repo root.
- Node.js runtime. Functions use `module.exports = async (req, res) => {...}` handler syntax.
- Supabase project ID: `koaainzpslvxnriuiuoa`
- Supabase URL: `https://koaainzpslvxnriuiuoa.supabase.co`
- Storage bucket name: `resumes`
- Existing function `/api/score.js` proxies Anthropic API. Follow the same fetch based pattern, do not introduce the `@supabase/supabase-js` dependency.
- User preference: no em dashes in any generated text or code comments.

## Current state of the database

Run this in Supabase SQL editor before starting to confirm:

```sql
select schemaname, tablename, rowsecurity from pg_tables where schemaname = 'public';
select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies where schemaname = 'public' order by tablename;
```

Expected: `jobs` has RLS enabled with two permissive policies ("Allow all operations" for public, "anon access" for anon). `gate_log`, `linkedin_targets`, `linkedin_posts` are already locked down. These open policies on `jobs` are what we are removing at the end.

## Tasks

### 1. Environment variables

Add three Vercel env vars (Settings, Environment Variables, all three environments: Production, Preview, Development):

- `SUPABASE_URL` = `https://koaainzpslvxnriuiuoa.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = grab from Supabase dashboard, Project Settings, API, "service_role" key (the secret one, not the publishable key)
- `JCC_PASSWORD` = `Jcc2025` (matches the existing hardcoded value in the frontend)

The service role key must never appear in client side code or be committed to git.

### 2. Create `/api/jobs.js`

Handles two methods:

- `GET` returns all non archived jobs ordered by `added_at` desc as `{ jobs: [...] }`
- `POST` accepts `{ jobs: [...] }` and upserts via the Supabase REST API with `Prefer: resolution=merge-duplicates`

Requires `x-jcc-password` header matching the `JCC_PASSWORD` env var. Returns 401 if missing or wrong.

Use plain fetch against the Supabase REST API at `https://<url>/rest/v1/jobs`. Include `apikey` and `Authorization: Bearer` headers using the service role key.

Set `module.exports.config = { api: { bodyParser: { sizeLimit: '4mb' } } }`.

### 3. Create `/api/resume-upload.js`

Handles `POST` with body `{ fileName, fileData, jobId, contentType }` where `fileData` is base64. Decodes to a Buffer, uploads to Supabase Storage at path `{jobId}/{fileName}` in the `resumes` bucket via the Storage REST API at `https://<url>/storage/v1/object/resumes/{path}` with `x-upsert: true` header. Returns `{ url: <public url> }`.

Same password gate. Same body parser size limit at 5mb (resumes can be larger than JSON payloads).

### 4. Refactor `job-command-center2.html`

This is the biggest piece. Touch only the relevant sections, do not rewrite the whole file.

**Remove:**

- The `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>` line in the `<head>`
- The constants `SUPABASE_URL`, `SUPABASE_KEY`, and `const db = window.supabase.createClient(...)` inside the main script tag

**Modify the password gate** (currently sets `sessionStorage.setItem('Jcc-auth', PASS)`):

Keep it as is. The password value entered by the user is what gets sent as the `x-jcc-password` header on every API call. Read it from sessionStorage on each call.

**Add a helper near the top of the script:**

```javascript
async function apiCall(path, options = {}) {
  const pw = sessionStorage.getItem('Jcc-auth');
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-jcc-password': pw,
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API ${path} failed: ${res.status} ${errText}`);
  }
  return res.json();
}
```

**Replace the initial data load** in `window.onload`:

```javascript
// before:
const { data, error } = await db.from('jobs').select('*').eq('archived', false).order('added_at', { ascending: false });

// after:
const { jobs: data } = await apiCall('/api/jobs');
```

Keep the mapping from snake_case to camelCase that follows it.

**Replace `saveJobs()`:**

```javascript
async function saveJobs() {
  const payload = jobs.map(j => ({
    id: String(j.id),
    title: j.title,
    company: j.company,
    location: j.location || '',
    listing: j.listing,
    apply_url: j.applyUrl || '',
    score: j.score,
    resume_used: j.resumeUsed,
    feedback: j.feedback,
    keywords: j.keywords,
    status: j.status,
    added_at: j.addedAt,
    notes: j.notes || '',
    source: j.source || 'manual',
    linkedin_url: j.linkedinUrl || '',
    archived: j.archived || false,
    rejection_reason: j.rejectionReason || '',
    applied_at: j.appliedAt || null,
    status_history: j.statusHistory || {},
    resume_pdf_url: j.resumePdfUrl || null,
    resume_docx_url: j.resumeDocxUrl || null,
    contacts: j.contacts || [],
    qa: j.qa || [],
    cover_letter: j.coverLetter || '',
  }));

  try {
    await apiCall('/api/jobs', {
      method: 'POST',
      body: JSON.stringify({ jobs: payload }),
    });
  } catch (err) {
    console.error('Save error:', err);
  }
}
```

**Replace `uploadResume(type)`:**

The current implementation uses `db.storage.from('resumes').upload(...)` and `db.storage.from('resumes').getPublicUrl(...)`. Replace with a base64 upload through the new API:

```javascript
async function uploadResume(type) {
  const job = jobs.find(j => String(j.id) === String(selectedJobId));
  if (!job) return;

  const accept = type === 'pdf' ? '.pdf' : '.docx';
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = accept;
  input.onchange = async function() {
    const file = input.files[0];
    if (!file) return;

    const statusEl = document.getElementById(`resume-${type}-status`);
    statusEl.textContent = 'Uploading...';

    try {
      const fileData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const { url } = await apiCall('/api/resume-upload', {
        method: 'POST',
        body: JSON.stringify({
          fileName: file.name,
          fileData,
          jobId: job.id,
          contentType: file.type,
        }),
      });

      if (type === 'pdf') job.resumePdfUrl = url;
      else job.resumeDocxUrl = url;

      await saveJobs();
      renderResumeSection(job);
      statusEl.textContent = 'Uploaded';
    } catch (err) {
      statusEl.textContent = 'Upload failed: ' + err.message;
    }
  };
  input.click();
}
```

### 5. Verify locally and in production

After changes, test these flows in order:

1. Page loads, password prompt appears, entering `Jcc2025` lets you in
2. Existing jobs render in the kanban
3. Score a new job, add to pipeline, verify it persists after reload
4. Change a job status, verify it persists after reload
5. Upload a resume PDF to any job, verify the download link works after reload
6. Open DevTools, Network tab. Confirm only `/api/jobs`, `/api/resume-upload`, and `/api/score` requests are made. There should be no requests to `koaainzpslvxnriuiuoa.supabase.co`.

If any step fails, stop and report the error before continuing.

### 6. Drop the open policies

Only after step 5 fully passes. Run in Supabase SQL editor:

```sql
drop policy if exists "Allow all operations" on public.jobs;
drop policy if exists "anon access" on public.jobs;
```

Then verify:

```sql
select policyname, roles, cmd from pg_policies
where schemaname = 'public' and tablename = 'jobs';
```

Expected: empty result. The table now has RLS enabled with zero policies, so anon cannot read or write anything. The service role key bypasses RLS so the API still works.

Test once more: reload the page, confirm jobs still load and save. If they do not, the API is not using the service role key properly. Do not re add the policies, fix the API.

### 7. Optional but recommended cleanup

- Storage bucket `resumes` policies: confirm it has no anon read or write policies. If it does, drop them. Public read of the resume URL still works via the public URL path because Supabase Storage public buckets bypass RLS for read.
- Consider rotating the publishable key in Supabase (Project Settings, API, "Roll publishable key") since the old one was exposed in the frontend. Not strictly required since with RLS locked down it can do nothing, but good hygiene.

## Notes and gotchas

- The publishable key currently in the file is `sb_publishable_biLMaC_FHIyiMl4aaVDZbQ_CvQ6pk3J`. It can be deleted from the file entirely, not just commented out.
- The Anthropic API key flow (saved in localStorage, sent through `/api/score`) is unchanged. Do not touch it.
- The existing rate limiting and other behavior on `/api/score` is fine. Use it as a reference for the new endpoints.
- If the jobs table has a row with an `id` that conflicts on upsert and you see 409 errors, the `unique_title_company` constraint was already removed per project history. The upsert uses `id` as the conflict key via merge-duplicates.
- Keep all generated text and comments free of em dashes (user preference).
