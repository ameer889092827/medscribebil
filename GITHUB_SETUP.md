# GitHub Setup Instructions

## Option 1: Using Git Command Line

### Step 1: Install Git
Download and install Git from: https://git-scm.com/download/win

After installation, restart your terminal/PowerShell.

### Step 2: Initialize Git Repository
```powershell
git init
```

### Step 3: Add All Files
```powershell
git add .
```

### Step 4: Create Initial Commit
```powershell
git commit -m "Initial commit: Secure backend with Express server"
```

### Step 5: Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repository (don't initialize with README)
3. Copy the repository URL

### Step 6: Add Remote and Push
```powershell
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## Option 2: Using GitHub Desktop (Easier)

1. Download GitHub Desktop: https://desktop.github.com/
2. Install and sign in with your GitHub account
3. Click "File" → "Add Local Repository"
4. Select this folder: `C:\Users\pasha\Downloads\MedScribe-main\MedScribe-main`
5. Click "Publish repository" button
6. Choose repository name and visibility
7. Click "Publish Repository"

---

## Option 3: Using GitHub CLI (gh)

If you have GitHub CLI installed:
```powershell
gh repo create MedScribe --public --source=. --remote=origin --push
```

---

## Important Notes

✅ The `.env` file is already in `.gitignore` - your API key will NOT be pushed
✅ Make sure to commit `server.js`, `package.json`, and updated `.gitignore`
✅ The `dist` folder is also ignored (build output)
