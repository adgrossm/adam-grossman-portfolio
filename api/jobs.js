const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const JCC_PASSWORD = process.env.JCC_PASSWORD;

module.exports = async function handler(req, res) {
  if (req.headers['x-jcc-password'] !== JCC_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabaseHeaders = {
    'apikey': SUPABASE_SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
  };

  if (req.method === 'GET') {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/jobs?archived=eq.false&order=added_at.desc`,
      { headers: supabaseHeaders }
    );
    const jobs = await response.json();
    return res.status(200).json({ jobs });
  }

  if (req.method === 'POST') {
    const { jobs } = req.body;
    const response = await fetch(`${SUPABASE_URL}/rest/v1/jobs`, {
      method: 'POST',
      headers: {
        ...supabaseHeaders,
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify(jobs),
    });
    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

module.exports.config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};
