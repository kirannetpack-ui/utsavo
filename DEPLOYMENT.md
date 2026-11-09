# UTSAVO — Deployment & Synchronization Guide

## 1. Local Machine Synchronization (`C:\Google AI Studio\Utsavo`)
All code and assets are synchronized with your GitHub repository: `https://github.com/kirannetpack-ui/utsavo.git`.

To maintain and run the project locally on your Windows computer in `C:\Google AI Studio\Utsavo`:

### Initial Clone (First Time)
Open **PowerShell** or **Command Prompt** and run:
```powershell
mkdir -p "C:\Google AI Studio"
cd "C:\Google AI Studio"
git clone https://github.com/kirannetpack-ui/utsavo.git Utsavo
cd "C:\Google AI Studio\Utsavo"
npm install
npm run dev
```

### Pulling Latest Updates
Whenever updates are made:
```powershell
cd "C:\Google AI Studio\Utsavo"
git pull origin main
```

---

## 2. GitHub Repository Status
- **Remote Origin**: `https://github.com/kirannetpack-ui/utsavo.git`
- **Default Branch**: `main` (Latest commit pushed successfully with force lease tracking)
- **Included Features**:
  1. **Destination Celebrations in Nepal**: Curated luxury itineraries (Pokhara Lakeside, Kathmandu Durbar UNESCO, Nagarkot Himalayan Sunrise, Chitwan Royal Jungle Safari, Muktinath Valley, Everest Heli Glacier Champagne) with Gemini AI global requirements sourcing (visas, high-altitude logistics, bridal customs, currency conversions).
  2. **Venue Operator Media & Photo Uploads**: Multi-file upload via registration modal or dashboard KYC tab, with interactive inline metadata editing (category, caption, cover photo assignment, deletion).
  3. **Venue Offers & Promotional Discounts**: Real-time discount management with Bikram Sambat validity, minimum guest thresholds, preview badges on venue cards, and catalog filter pill.
  4. **Venue KYC & Physical Facility Inspection**: PAN/registration verification plus high-resolution facility inspection records (entrance, main banquet hall, commercial kitchen hygiene, backup genset, fire exits).
  5. **Analytics Dashboard**: Recharts-powered booking trends, peak inquiry hours, and conversion rates.

---

## 3. Vercel Deployment (`https://vercel.com/kiran-thapa-s-projects`)

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

