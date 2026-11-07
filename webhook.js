// Paystack calls this when a payment succeeds or fails
const crypto = require('crypto');
module.exports = async (req, res) => {
  const chunks = []; for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks);
  const sig = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY).update(raw).digest('hex');
  if (sig !== req.headers['x-paystack-signature']) return res.status(401).end();
  const ev = JSON.parse(raw);
  const status = ev.event === 'charge.success' ? 'paid' : ev.event === 'charge.failed' ? 'failed' : null;
  if (status) await fetch(`${process.env.SUPABASE_URL}/rest/v1/orders?reference=eq.${ev.data.reference}`, {
    method: 'PATCH',
    headers: { apikey: process.env.SUPABASE_SERVICE_KEY, Authorization: 'Bearer ' + process.env.SUPABASE_SERVICE_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  res.status(200).end();
};
module.exports.config = { api: { bodyParser: false } };
