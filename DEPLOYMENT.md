# UTSAVO — Deployment & GitHub Integration Guide

## 1. GitHub Repository Linked
This repository is configured with:
- **Remote Origin**: `https://github.com/kirannetpack-ui/utsavo.git`
- **Default Branch**: `main`

### To Push to GitHub:
If you are using GitHub Personal Access Token (PAT) or SSH:
```bash
# Push with personal access token or configured credential helper:
git push -u origin main
```
Or, if you prefer SSH:
```bash
git remote set-url origin git@github.com:kirannetpack-ui/utsavo.git
git push -u origin main
```

---

## 2. Vercel Deployment (`https://vercel.com/kiran-thapa-s-projects`)

The project is pre-configured with `vercel.json` and `api/index.ts` for instant zero-configuration deployment on Vercel:

### Option A: Automatic Git Integration (Recommended)
1. Go to your Vercel Dashboard: [https://vercel.com/kiran-thapa-s-projects](https://vercel.com/kiran-thapa-s-projects)
2. Click **"Add New..."** &gt; **"Project"**
3. Select and import the GitHub repository: **`kirannetpack-ui/utsavo`**
4. Configure Environment Variables in Vercel Project Settings:
   - `GEMINI_API_KEY`: Your Google Gemini API Key
   - `NODE_ENV`: `production`
5. Click **"Deploy"**. Vercel will run `npm run build` and route client and serverless API endpoints (`/api/*`) seamlessly.

### Option B: Deploy via Vercel CLI
If you have Vercel CLI installed locally:
```bash
npm install -g vercel
vercel login
vercel --prod
```
When prompted for the scope, select your account: **`kiran-thapa-s-projects`**.
