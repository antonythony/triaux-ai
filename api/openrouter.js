// Serverless function for Vercel: keeps your OpenRouter API key secret
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    // Read raw request body (works in Vercel "Other" projects)
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString() || '{}';

    // Forward the request to OpenRouter with your server-side key
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Title': 'TriAxis AI'
        // Optionally: 'HTTP-Referer': process.env.APP_URL || ''
      },
      body: raw
    });

    const text = await r.text();
    res.status(r.status).setHeader('Content-Type', 'application/json').send(text);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
