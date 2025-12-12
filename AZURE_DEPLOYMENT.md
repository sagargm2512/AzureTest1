# Azure Deployment Guide

This guide will help you deploy your NestJS application to Azure App Service using GitHub Actions.

## Prerequisites

- Azure subscription
- GitHub repository with this code
- MongoDB connection string (from MongoDB Atlas or your instance)

---

## Step 1: Create Azure Resources

### Option A: Using Azure Portal (Recommended for beginners)

1. **Create Resource Group**
   - Go to [Azure Portal](https://portal.azure.com)
   - Search for "Resource Groups"
   - Click "Create"
   - Name: `intralinked-rg`
   - Region: Choose closest to your users
   - Click "Review + Create" → "Create"

2. **Create App Service Plan**
   - Search for "App Service plans"
   - Click "Create"
   - Resource Group: `intralinked-rg`
   - Name: `intralinked-plan`
   - OS: Linux
   - Region: Same as resource group
   - Pricing tier: B1 (Free tier or lowest cost)
   - Click "Review + Create" → "Create"

3. **Create Web App (App Service)**
   - Search for "App Services"
   - Click "Create"
   - Resource Group: `intralinked-rg`
   - Name: `intralinked-app` (must be globally unique)
   - Publish: Code
   - Runtime stack: Node 20 LTS
   - App Service Plan: `intralinked-plan`
   - Click "Review + Create" → "Create"

### Option B: Using Azure CLI

```bash
# Login to Azure
az login

# Create resource group
az group create --name intralinked-rg --location eastus

# Create app service plan
az appservice plan create \
  --name intralinked-plan \
  --resource-group intralinked-rg \
  --sku B1 \
  --is-linux

# Create web app
az webapp create \
  --resource-group intralinked-rg \
  --plan intralinked-plan \
  --name intralinked-app \
  --runtime "NODE|20-lts"
```

---

## Step 2: Configure Environment Variables in Azure

1. Go to Azure Portal → Your App Service (intralinked-app)
2. In left menu, click "Configuration"
3. Click "+ New application setting"
4. Add these settings:

| Name | Value | Notes |
|------|-------|-------|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/EmployeeData` | Your MongoDB connection string |
| `NODE_ENV` | `production` | Environment type |
| `PORT` | `8080` | Azure default port |

5. Click "Save"

**Important:** After saving, Azure will restart your app.

---

## Step 3: Get Azure Publish Profile

1. Go to Azure Portal → Your App Service → **Overview**
2. Click **"Get publish profile"** button (top right)
3. This downloads an XML file with deployment credentials

---

## Step 4: Set GitHub Secret

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `AZURE_PUBLISH_PROFILE`
5. Value: Copy the entire content of the publish profile XML file
6. Click "Add secret"

---

## Step 5: Update GitHub Actions Workflow

Edit `.github/workflows/azure-deploy.yml`:

```yaml
env:
  AZURE_WEBAPP_NAME: 'intralinked-app'  # ← Change to your actual app name
  AZURE_WEBAPP_PACKAGE_PATH: './dist'
  NODE_VERSION: '20.x'
```

Update `AZURE_WEBAPP_NAME` to match your Azure App Service name.

---

## Step 6: Deploy via GitHub

### First Deployment:

1. Commit and push changes:
   ```bash
   git add .
   git commit -m "Add Azure deployment configuration"
   git push origin main
   ```

2. Go to GitHub → Your repository → **Actions** tab
3. Click the workflow "Deploy to Azure App Service"
4. Monitor the deployment progress
5. Once complete, visit: `https://intralinked-app.azurewebsites.net`

### Subsequent Deployments:

Just push to `main` or `master` branch - GitHub Actions will automatically deploy!

```bash
git add .
git commit -m "Your changes"
git push origin main
```

---

## Step 7: Verify Deployment

1. **Check GitHub Actions**
   - Go to Actions tab
   - Verify the workflow completed successfully (green checkmark)

2. **Check Azure**
   - Go to Azure Portal → App Service
   - Check "Overview" for deployment status
   - Click "Browse" to visit your app

3. **Monitor Logs**
   ```bash
   # Using Azure CLI
   az webapp log tail --name intralinked-app --resource-group intralinked-rg
   ```

---

## Troubleshooting

### Deployment Fails in GitHub Actions

**Check the workflow logs:**
1. GitHub → Actions → Failed workflow
2. Click the failed job
3. Look for error messages in logs

Common issues:
- `npm install` fails → Check package.json dependencies
- `npm run build` fails → Check TypeScript errors
- Missing secrets → Verify `AZURE_PUBLISH_PROFILE` secret is set

### App doesn't start on Azure

**Check app logs:**

```bash
# Stream logs in real-time
az webapp log tail --name intralinked-app --resource-group intralinked-rg

# Or via Portal: App Service → Log stream
```

Common issues:
- Missing environment variables → Add `MONGODB_URI` in Configuration
- Wrong Node version → Verify in Portal → Configuration → General settings
- Port not 8080 → Ensure app listens on `process.env.PORT || 3000`

### MongoDB connection fails

**Verify connection string:**
1. Check `MONGODB_URI` in Azure Portal → Configuration
2. For MongoDB Atlas, ensure:
   - IP whitelist includes Azure IP (or allow all: 0.0.0.0/0)
   - Username/password are correct
   - Database name matches

### Application crashed

**Check Azure diagnostics:**
1. Azure Portal → App Service → Diagnose and solve problems
2. Look for error patterns
3. Check event logs

---

## Important Security Notes

⚠️ **CRITICAL:**
- Never commit `.env` file (already in `.gitignore`)
- Use GitHub Secrets for sensitive data
- Keep MongoDB credentials secure
- Use strong passwords for MongoDB Atlas

---

## Scaling & Performance

### Monitor Performance
```bash
az monitor metrics list \
  --resource /subscriptions/{subscriptionId}/resourceGroups/intralinked-rg/providers/Microsoft.Web/sites/intralinked-app \
  --metric "AverageResponseTime" \
  --start-time 2024-01-01T00:00:00Z
```

### Scale Up (if needed)
- Azure Portal → App Service Plan → Scale up
- Change pricing tier to higher (B2, S1, P1, etc.)

---

## Additional Resources

- [Azure App Service Documentation](https://learn.microsoft.com/en-us/azure/app-service/)
- [Deploying Node.js to Azure](https://learn.microsoft.com/en-us/azure/app-service/quickstart-nodejs)
- [GitHub Actions Azure Login](https://github.com/marketplace/actions/azure-login)
- [MongoDB Atlas Connection Guide](https://docs.atlas.mongodb.com/driver-connection/)
