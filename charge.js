// POST = start MoMo prompt, GET ?ref= = check order status
const S = process.env.SUPABASE_URL, K = process.env.SUPABASE_SERVICE_KEY;
const H = { apikey: K, Authorization: 'Bearer ' + K, 'Content-Type': 'application/json' };
const PROV = { mtn: 'mtn', telecel: 'vod', airteltigo: 'atl' };
module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const r = await fetch(`${S}/rest/v1/orders?reference=eq.${encodeURIComponent(req.query.ref)}&select=status`, { headers: H });
      const [o] = await r.json();
      return res.json({ status: o ? o.status : 'unknown' });
    }
    const { name, phone, network, address, items } = req.body || {};
    if (!name || !phone || !PROV[network] || !items?.length) return res.status(400).json({ error: 'Missing details' });
    // prices come from the database, never from the browser
    const ids = items.map(i => i.id).join(',');
    const pr = await (await fetch(`${S}/rest/v1/products?id=in.(${ids})&select=id,price`, { headers: H })).json();
    const price = Object.fromEntries(pr.map(p => [p.id, Number(p.price)]));
    const amount = items.reduce((t, i) => t + (price[i.id] || 0) * Math.max(1, i.qty | 0), 0);
    if (!amount) return res.status(400).json({ error: 'Invalid cart' });
    const reference = 'CC' + Date.now();
    await fetch(`${S}/rest/v1/orders`, { method: 'POST', headers: H, body: JSON.stringify({ reference, name, phone, network, address, items, amount }) });
    const p = await (await fetch('https://api.paystack.co/charge', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + process.env.PAYSTACK_SECRET_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'orders@catherinecakes.com', amount: Math.round(amount * 100), currency: 'GHS', reference, mobile_money: { phone, provider: PROV[network] } })
    })).json();
    res.json({ reference, amount, message: p.data?.display_text || p.message, status: p.data?.status });
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
};
