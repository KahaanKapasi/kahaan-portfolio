# Deploying kahaankapasi.com

The site is a static Vite build (`dist/`) with client-side routing: no server, no database, no environment variables. Follow this top to bottom. Nothing here has been run for you; every command below is yours to run.

## 0. What is already in place

| Item | State |
| --- | --- |
| `npm run build` (`tsc -b && vite build`) | Passes. Output is `dist/` (about 12 MB, mostly images and the three.js chunk, which only loads on 3D pages). |
| `vercel.json` | SPA rewrite `/(.*)` to `/index.html` (real files such as `/assets/*` and `/work/*` are served first, so only app routes fall through). A permanent redirect from the old `/work/storemad` to `/work/madridonomy-store`. A one-year `immutable` cache on `/assets/*` (hashed file names). A one-day cache with a week of stale-while-revalidate on `/work`, `/home`, `/concepts` and `/thumbs` images (their names are not hashed). `nosniff` and a referrer policy on everything. |
| `.gitignore` | Covers `node_modules`, `dist`, `*.tsbuildinfo`, `.env*`, `*.local`, `.vercel`, `logs/`, `*.log`, `.DS_Store`, `.impeccable/live`, `.impeccable/review/` (6 MB of review screenshots) and `scripts/autos/ledger.json`. |
| `scripts/autos/ledger.json` | A spend tally and prompt log from the Autos photo-edit run. It holds no keys or secrets, so committing it would be harmless; it is ignored only to keep the repo clean. Delete that line from `.gitignore` if you want it in the history. |
| Secrets | None in the repo. `.env*` is ignored. `scripts/autos/gen_variants.py` names a local path to another project's env file but contains no key; it is a one-off tool, not part of the site. |
| `index.html` | `canonical`, `og:url`, `og:image` and `twitter:image` all point at `https://kahaankapasi.com/`. |
| Node | Use Node 22 (the build was verified on 22.17). |

Check it yourself once before deploying:

```bash
cd /Users/kk/Desktop/kahaan-portfolio
npm install          # first time, or after pulling changes
npm run build        # must end with "built in ..." and no errors
npm run preview      # optional: http://localhost:4173, click through the routes
```

## 1. Path A: GitHub + Vercel import (recommended)

Every push to `main` redeploys, every other branch gets its own preview URL, and rollback is one click.

1. **Make it a git repo** (skip if `git status` already works in the folder):
   ```bash
   cd /Users/kk/Desktop/kahaan-portfolio
   git init -b main
   ```
2. **Check what will be committed.** Confirm no `.env*`, `dist/` or `node_modules/` appear:
   ```bash
   git status
   ```
3. **First commit:**
   ```bash
   git add .
   git commit -m "Initial portfolio"
   ```
4. **Create the GitHub repo** at github.com/new: name it `kahaan-portfolio`, private or public, with no README, no .gitignore and no licence. Then connect and push (replace `YOUR-USER`):
   ```bash
   git remote add origin https://github.com/YOUR-USER/kahaan-portfolio.git
   git push -u origin main
   ```
   With the GitHub CLI instead: `gh repo create kahaan-portfolio --private --source=. --push`.
5. **Import into Vercel:** go to vercel.com/new, sign in with GitHub and Import the `kahaan-portfolio` repo. On the configure screen set:
   - Framework Preset: **Vite**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Node.js Version: **22.x** (Settings, General, if the import screen does not show it)
   - Environment Variables: none
6. Click **Deploy**. When it finishes, open the `*.vercel.app` URL and click through the routes before touching the domain.

## 2. Path B: Vercel CLI (no GitHub)

```bash
npm i -g vercel
cd /Users/kk/Desktop/kahaan-portfolio
vercel               # first run: log in, accept the Vite defaults (build npm run build, output dist); makes a preview deploy
vercel --prod        # production deploy
```

The CLI reads `vercel.json`, so deep links and cache headers work. Re-run `vercel --prod` for every update.

Do not use the drag-and-drop "Vercel Drop" of `dist/`: it does not carry `vercel.json`, so refreshing on a deep link would 404.

## 3. Custom domain: kahaankapasi.com

1. **Buy `kahaankapasi.com`** at a registrar (Vercel Domains, Namecheap, GoDaddy, Cloudflare and so on). Turn on auto-renew.
2. In Vercel open the project, **Settings, Domains, Add**, enter `kahaankapasi.com`, then add `www.kahaankapasi.com`.
3. **Point DNS.** Vercel shows the exact records it wants next to each domain; **verify the values it shows and use those if they differ from the ones below.** The usual set:

   | Host | Type | Value |
   | --- | --- | --- |
   | `@` (apex, `kahaankapasi.com`) | `A` | `76.76.21.21` |
   | `www` | `CNAME` | `cname.vercel-dns.com` |

   Add them on the registrar's DNS page. Alternative: change the domain's **nameservers** to the ones Vercel shows (normally `ns1.vercel-dns.com` and `ns2.vercel-dns.com`) and let Vercel manage DNS. If you bought the domain through Vercel, this is already done.
4. **Redirect `www` to the apex.** In Settings, Domains, edit the `www.kahaankapasi.com` row and set it to redirect to `kahaankapasi.com` (308). Keep `kahaankapasi.com` as the primary domain with no redirect.
5. **Wait.** DNS can take minutes to a few hours. Both rows turn to a green "Valid Configuration" and Vercel issues the HTTPS certificate by itself.
6. **Confirm the canonical URL.** `index.html` already uses `https://kahaankapasi.com/` in `canonical`, `og:url`, `og:image` and `twitter:image`. If the final domain is different, change those four values, rebuild and redeploy.

## 4. Post-deploy checklist

- [ ] `https://kahaankapasi.com` loads over HTTPS; `https://www.kahaankapasi.com` redirects to it.
- [ ] Open every route by typing the URL, then refresh it: `/`, `/work/flippr-app`, `/work/flippr-live`, `/work/auction-flippr-live`, `/work/madridonomy`, `/work/madridonomy-store`, `/work/footonomy`, `/work/content-studio`, `/work/chatspace`, `/concepts/footonomy`, `/concepts/autos`, `/concepts/architecture`, `/concepts/fintech`, plus a nonsense URL for the 404 page.
- [ ] `/work/storemad` redirects to `/work/madridonomy-store`.
- [ ] **Real phones:** iOS Safari and a mid-range Android in Chrome. Check the WebGL hero on `/`, the bottom navigation pill against the browser bars, the `100svh` hero and the 3D scenes on `/concepts/footonomy`. Append `?static` to a URL to see the non-WebGL fallback.
- [ ] **Share preview:** paste the link into WhatsApp, LinkedIn and X (LinkedIn's Post Inspector forces a refresh). Platforms cache previews, so a stale card can take a while to update.
- [ ] **Lighthouse:** Chrome DevTools, Lighthouse, Mobile, on `/` and one case study. Note LCP, total blocking time and accessibility, and keep the report for comparison.
- [ ] Contact links work: `kahaankapasi@gmail.com` and `linkedin.com/in/KahaanKapasi`.
- [ ] The flippr.live case study shows its screenshots; "Load live preview" either shows the site or falls back to "Open live".
- [ ] The browser console is clean on `/` and on one case study.

## 5. Rollback

Vercel keeps every deployment. If a release is bad: open the project, **Deployments**, find the last good one, open its menu and choose **Promote to Production** (instant, no rebuild). With the CLI, `vercel rollback` does the same. For a Git-based project you can also `git revert` the bad commit and push. Domains and DNS are not touched by any of this.
