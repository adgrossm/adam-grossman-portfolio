const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const JCC_PASSWORD = process.env.JCC_PASSWORD;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (req.headers['x-jcc-password'] !== JCC_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { fileName, fileData, jobId, contentType } = req.body;
  if (!fileName || !fileData || !jobId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const buffer = Buffer.from(fileData, 'base64');
  const path = `${jobId}/${fileName}`;

  const response = await fetch(
    `${SUPABASE_URL}/storage/v1/object/resumes/${path}`,
    {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': contentType || 'application/octet-stream',
        'x-upsert': 'true',
      },
      body: buffer,
    }
  );

  if (!response.ok) {
    const err = await response.text();
    return res.status(response.status).json({ error: err });
  }

  const url = `${SUPABASE_URL}/storage/v1/object/public/resumes/${path}`;
  return res.status(200).json({ url });
};

module.exports.config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
};
