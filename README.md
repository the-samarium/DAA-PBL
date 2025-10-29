## AgriLink Lite

Next.js app to rent/buy agricultural equipment using Supabase (auth + data) and Tailwind (shadcn/ui).

### Requirements
- Node 18+
- Supabase project (URL + anon key)

### Env
Create `DAA-PBL/.env.local`:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key


### Install & Run
```bash
cd DAA-PBL
npm install
npm run dev
# http://localhost:3000
```

### Supabase schema
Run in Supabase SQL Editor:
- Open `supabase-updates.sql` from this repo and execute it (creates tables + RLS).

