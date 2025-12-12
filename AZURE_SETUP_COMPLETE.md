# 🚀 Azure Deployment - Complete Setup Guide

## Overview

You're deploying a NestJS application with MongoDB to Azure App Service using GitHub Actions CI/CD pipeline.

**What gets deployed:**
- NestJS backend API
- Automatic builds on GitHub push
- MongoDB Atlas integration
- Node.js 20 runtime

---

## 📋 Complete Step-by-Step Setup

### **PART 1: Azure Account & Resources (10 mins)**

#### Step 1.1: Create Azure Resources

**Using Azure CLI (Fastest):**

```bash
# Login
az login

# Create resource group
az group create --name intralinked-rg --location eastus

# Create App Service Plan (Linux, Node 20)
az appservice plan create \
  --name intralinked-plan \
  --resource-group intralinked-rg \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --resource-group intralinked-rg \
  --plan intralinked-plan \
  --name intralinked-app \
  --runtime "NODE|20-lts"
```

**Or manually in Azure Portal:**
1. Create Resource Group: `intralinked-rg`
2. Create App Service Plan: `intralinked-plan` (Node 20, B1 pricing)
3. Create App Service: `intralinked-app`

#### Step 1.2: Set Environment Variables in Azure

```bash
# Set MONGODB_URI (replace with your actual connection string)
az webapp config appsettings set \
  --name intralinked-app \
  --resource-group intralinked-rg \
  --settings MONGODB_URI="mongodb+srv://user:password@cluster.mongodb.net/EmployeeData"

# Set NODE_ENV
az webapp config appsettings set \
  --name intralinked-app \
  --resource-group intralinked-rg \
  --settings NODE_ENV="production"

# Set PORT (Azure default)
az webapp config appsettings set \
  --name intralinked-app \
  --resource-group intralinked-rg \
  --settings PORT="8080"
```

**Or manually via Portal:**
1. Azure Portal → intralinked-app → Configuration
2. Add Application Settings:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NODE_ENV`: `production`
   - `PORT`: `8080`
3. Click Save (app will restart)

---

### **PART 2: GitHub Setup (5 mins)**

#### Step 2.1: Get Azure Publish Profile

```bash
# Download publish profile via CLI
az webapp deployment list-publishing-profiles \
  --name intralinked-app \
  --resource-group intralinked-rg \
  --query "[0].publishUrl" --output tsv
```

**Or manually via Portal:**
1. Azure Portal → intralinked-app → Overview
2. Click **"Get publish profile"** (top right)
3. Save the XML file

#### Step 2.2: Add GitHub Secret

1. GitHub → Your Repository → Settings
2. Secrets and variables → Actions
3. New repository secret:
   - **Name**: `AZURE_PUBLISH_PROFILE`
   - **Value**: Paste entire publish profile XML content
4. Add secret

#### Step 2.3: Verify Workflow File

The file `.github/workflows/azure-deploy.yml` is already created. Verify:

```yaml
env:
  AZURE_WEBAPP_NAME: 'intralinked-app'  # ← Must match your app name
  AZURE_WEBAPP_PACKAGE_PATH: './dist'
  NODE_VERSION: '20.x'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      # Build steps...
      
  deploy:
    needs: build-and-deploy
    steps:
      # Deploy steps...
      - uses: azure/webapps-deploy@v2
        with:
          app-name: ${{ env.AZURE_WEBAPP_NAME }}
          publish-profile: ${{ secrets.AZURE_PUBLISH_PROFILE }}
```

---

### **PART 3: Deploy Application (5 mins)**

#### Step 3.1: Commit & Push

```bash
# Pull latest changes from GitHub
git pull origin main

# Add all files
git add .

# Commit
git commit -m "Add Azure deployment configuration"

# Push to main branch
git push origin main
```

#### Step 3.2: Monitor Deployment

**GitHub Actions:**
1. Go to GitHub → Your Repository → Actions tab
2. You'll see workflow: "Deploy to Azure App Service"
3. Watch the progress (should take 5-10 minutes)
4. Each step should show ✅ green checkmark
5. Look for: Build → Test → Deploy → Success

**Expected workflow steps:**
```
✅ Checkout code
✅ Setup Node.js 20.x
✅ Install dependencies
✅ Build application
✅ Run tests
✅ Upload artifact
✅ Deploy to Azure Web App
```

---

### **PART 4: Verify Live Application (5 mins)**

#### Step 4.1: Test Your App

```bash
# Visit your deployed app
https://intralinked-app.azurewebsites.net

# Test API endpoint
curl https://intralinked-app.azurewebsites.net/users
```

#### Step 4.2: Check Azure Logs

```bash
# Stream real-time logs
az webapp log tail --name intralinked-app --resource-group intralinked-rg

# Or via Portal: App Service → Log stream
```

#### Step 4.3: Verify Database Connection

App should connect to MongoDB and respond with user data:
```json
{
  "status": "connected",
  "data": [...]
}
```

---

## 🔄 Future Deployments

**It's automatic!** Just push to `main` or `master`:

```bash
# Make changes
git add .
git commit -m "Update users endpoint"
git push origin main

# GitHub Actions automatically:
# 1. Builds the application
# 2. Runs tests
# 3. Deploys to Azure
# ✅ Done! (5-10 minutes)
```

---

## 📊 Architecture

```
GitHub Repository (main branch)
        ↓
GitHub Actions CI/CD
        ↓
Build: npm install → npm run build
        ↓
Test: npm run test
        ↓
Deploy: azure/webapps-deploy@v2
        ↓
Azure App Service (intralinked-app)
        ↓
MongoDB Atlas (via MONGODB_URI)
```

---

## 🛠 Configuration Files Explained

| File | Purpose |
|------|---------|
| `.github/workflows/azure-deploy.yml` | GitHub Actions pipeline |
| `web.config` | IIS configuration for Azure |
| `Dockerfile` | Container image (optional) |
| `.dockerignore` | Exclude files from Docker |
| `src/main.ts` | Listens on PORT 8080 (Azure) |
| `src/app.module.ts` | Reads MONGODB_URI from env |

---

## ❌ Troubleshooting

### **Deployment Failed in GitHub Actions**

**Check logs:**
1. GitHub → Actions → Failed workflow
2. Click the job name for detailed error log

**Common fixes:**
```bash
# Build error? Test locally first
npm install
npm run build
npm start

# Missing dependencies?
npm install --save missing-package

# Commit and push again
git push origin main
```

### **App Not Responding (404 errors)**

**Check Azure logs:**
```bash
az webapp log tail --name intralinked-app --resource-group intralinked-rg
```

**Common fixes:**
- Missing environment variable: Add `MONGODB_URI` to Configuration
- Wrong port: Ensure `PORT=8080` in Configuration
- MongoDB connection issue: Check connection string format

### **MongoDB Connection Failed**

**Verify:**
```bash
# Check MONGODB_URI is set
az webapp config appsettings list \
  --name intralinked-app \
  --resource-group intralinked-rg

# Test connection string locally
# Copy MONGODB_URI value and test in .env locally
```

**MongoDB Atlas specific:**
- IP Whitelist must include Azure (or allow 0.0.0.0/0)
- Username/password must be URL-encoded if special characters
- Example: `@` becomes `%40`, `:` becomes `%3A`

---

## 💡 Pro Tips

### Monitor Application
```bash
# View last 100 logs
az webapp log tail --name intralinked-app --resource-group intralinked-rg --lines 100

# Download logs
az webapp log download --name intralinked-app --resource-group intralinked-rg
```

### Update Environment Variables
```bash
# Change MONGODB_URI
az webapp config appsettings set \
  --name intralinked-app \
  --resource-group intralinked-rg \
  --settings MONGODB_URI="new_connection_string"

# App restarts automatically
```

### Rollback to Previous Version
```bash
# GitHub allows rolling back deployments
# Or manually redeploy previous commit
git revert HEAD
git push origin main
```

### Scale Application (if slow)
```bash
# Upgrade to higher tier
az appservice plan update \
  --name intralinked-plan \
  --resource-group intralinked-rg \
  --sku S1  # Higher tier (P1, P2, etc.)
```

---

## 📚 Resources

- [NestJS Deployment](https://docs.nestjs.com/)
- [Azure App Service Node.js](https://learn.microsoft.com/azure/app-service/quickstart-nodejs)
- [GitHub Actions Azure Deploy](https://github.com/marketplace/actions/azure-webapps-deploy)
- [MongoDB Atlas Connection](https://docs.atlas.mongodb.com/)
- [Azure CLI Commands](https://learn.microsoft.com/cli/azure/)

---

## ✅ Deployment Verification Checklist

After deployment:

- [ ] GitHub Actions workflow completed successfully (green checkmarks)
- [ ] App is accessible at `https://intralinked-app.azurewebsites.net`
- [ ] MongoDB connection successful (check logs)
- [ ] API endpoints responding
- [ ] No errors in Azure log stream
- [ ] Environment variables set correctly
- [ ] Application started without crashes

---

## 🎯 You're All Set!

Your NestJS application is now:
✅ Built automatically on every push to GitHub
✅ Tested with unit and e2e tests
✅ Deployed to Azure App Service
✅ Connected to MongoDB
✅ Accessible worldwide at your Azure URL

**Next push to `main` = Automatic deployment!**

---

Questions? Check the error logs:
```bash
# GitHub Actions logs
https://github.com/YOUR_USERNAME/YOUR_REPO/actions

# Azure App logs
az webapp log tail --name intralinked-app --resource-group intralinked-rg

# Or via Portal
https://portal.azure.com → intralinked-app → Log stream
```
