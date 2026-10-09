// Proxy hacia la API de Anthropic. La key se configura en Vercel como ANTHROPIC_API_KEY.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: { message: 'Method not allowed' } });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: { message: 'Falta ANTHROPIC_API_KEY en Vercel' } });
  const { model, max_tokens, system, messages } = req.body || {};
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model, max_tokens: Math.min(Number(max_tokens) || 400, 1000), system, messages }),
  });
  res.status(r.status).json(await r.json());
}
