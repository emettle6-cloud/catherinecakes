# CatherineCakes – setup (no coding needed)
1. **GitHub**: create a repo, upload everything in this folder (drag & drop works).
2. **Supabase**: new project > SQL Editor > paste `supabase/schema.sql` > Run. Copy Project URL and the *service_role* key (Settings > API).
3. **Paystack** (supports MTN, Telecel, AirtelTigo prompts in Ghana): create account, get the secret key. Settings > API > Webhook URL: `https://catherinecakes.com/api/webhook`
4. **Vercel**: Add New Project > import the GitHub repo > Environment Variables: the 3 values in `.env.example` > Deploy.
5. **Domain**: Vercel > Settings > Domains > add your domain, then change the DNS records at Squarespace to the ones Vercel shows.
Notes: change prices only in Supabase table `products` (also in `index.html` list for display). Telecel/AirtelTigo may ask for a voucher/OTP; test each network with GH₵1 before launch.
