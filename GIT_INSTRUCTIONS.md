# UTSAVO Git Commit & Push Guide (गिट कमिट तथा पुस निर्देशिका)

This guide provides the simplest instructions to commit and push all code changes to your GitHub repository:
**`https://github.com/kirannetpack-ui/utsavo.git`**

---

## ⚡ Option 1: The Simplest 1-Command Push (Recommended)

Run this single command whenever you want to commit and push:

```bash
bash push_to_github.sh YOUR_GITHUB_TOKEN
```

*(Replace `YOUR_GITHUB_TOKEN` with your GitHub Personal Access Token)*

This script automatically:
1. Fixes git container permissions (`safe.directory`).
2. Stages every changed file (`git add -A`).
3. Creates a timestamped commit if you have uncommitted changes.
4. Securely pushes directly to your `main` branch.

---

## 🔑 How to get your GitHub Token (Only takes 60 seconds)

Since GitHub removed password authentication in 2021, a Personal Access Token (PAT) is required for command-line pushes:

1. Log into your GitHub account: **[github.com](https://github.com)**
2. Go to **Settings** → **Developer Settings** → **Personal Access Tokens** → **Tokens (classic)**
   - Or directly open: **[https://github.com/settings/tokens](https://github.com/settings/tokens)**
3. Click **"Generate new token"** → **"Generate new token (classic)"**
4. Set Note to: `Utsavo Push Token`
5. Set Expiration: `No expiration` (or 90 days)
6. Check the box for:
   - ✅ **`repo`** *(Full control of private repositories)*
7. Click **"Generate token"** at the bottom.
8. Copy the token (it looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxx`).

---

## 🛠 Option 2: Step-by-Step Manual Git Commands

If you prefer running standard Git commands step-by-step:

### Step 1: Fix container directory permission (Run once)
```bash
git config --global --add safe.directory /app/applet
git config --global user.name "Kiran Sharma"
git config --global user.email "kiran67311@gmail.com"
```

### Step 2: Check current status
```bash
git status
```

### Step 3: Stage and commit all changes
```bash
git add -A
git commit -m "Your descriptive commit message"
```

### Step 4: Push to GitHub using your token
```bash
git push https://YOUR_GITHUB_TOKEN@github.com/kirannetpack-ui/utsavo.git main
```

---

## 🔒 Permanent Token Cache (Optional)

If you don't want to type your token every time, set it in the remote URL:

```bash
git remote set-url origin https://YOUR_GITHUB_TOKEN@github.com/kirannetpack-ui/utsavo.git
```

After doing this once, you can simply run:
```bash
git push origin main
```
