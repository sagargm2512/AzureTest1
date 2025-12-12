# Azure Deployment Checklist

Complete these steps in order to deploy your application to Azure through GitHub Actions.

## ✅ Pre-Deployment Setup

- [ ] Create Azure account (if you don't have one)
- [ ] Install Azure CLI: `az login`
- [ ] Ensure you have GitHub repository set up with this code
- [ ] Verify MongoDB connection string is ready

## ✅ Step 1: Create Azure Resources (5-10 minutes)

**Option A: Azure Portal (Recommended)**
- [ ] Create Resource Group: `intralinked-rg`
- [ ] Create App Service Plan: `intralinked-plan` (Node 20, Linux)
- [ ] Create App Service: `intralinked-app`

**Option B: Azure CLI**
```bash
az group create --name intralinked-rg --location eastus
az appservice plan create --name intralinked-plan --resource-group intralinked-rg --sku B1 --is-linux
az webapp create --resource-group intralinked-rg --plan intralinked-plan --name intralinked-app --runtime "NODE|20-lts"
```

## ✅ Step 2: Configure Environment Variables (2 minutes)

In Azure Portal:
1. Go to App Service → Configuration
2. Add Application Settings:
   - [ ] `MONGODB_URI`: Your MongoDB connection string
   - [ ] `NODE_ENV`: `production`
   - [ ] `PORT`: `8080`
3. Click Save

## ✅ Step 3: Get Publish Profile (1 minute)

1. [ ] Azure Portal → App Service → **Get publish profile** (top right)
2. [ ] Save the XML file

## ✅ Step 4: Add GitHub Secret (2 minutes)

1. [ ] Go to GitHub → Repository → Settings → Secrets and variables → Actions
2. [ ] Click "New repository secret"
3. [ ] Name: `AZURE_PUBLISH_PROFILE`
4. [ ] Value: Paste entire content of publish profile XML
5. [ ] Click "Add secret"

## ✅ Step 5: Update Workflow (1 minute)

Edit `.github/workflows/azure-deploy.yml`:
- [ ] Update `AZURE_WEBAPP_NAME` to your app name (`intralinked-app`)

## ✅ Step 6: Commit & Push (2 minutes)

```bash
git add .
git commit -m "Add Azure deployment configuration"
git push origin main
```

- [ ] Code pushed to GitHub

## ✅ Step 7: Monitor Deployment (5-10 minutes)

1. [ ] Go to GitHub → Actions tab
2. [ ] Watch "Deploy to Azure App Service" workflow
3. [ ] Verify all steps complete (green checkmarks)
4. [ ] Workflow duration: ~5-10 minutes

## ✅ Step 8: Verify Live App (1 minute)

- [ ] Visit: `https://intralinked-app.azurewebsites.net`
- [ ] Check that app is responding
- [ ] Test API endpoints

## ✅ Post-Deployment (Optional)

- [ ] Set up monitoring & alerts
- [ ] Configure custom domain
- [ ] Review deployment logs
- [ ] Configure auto-scaling if needed

---

## 🚀 Total Time: ~30-40 minutes

---

## Troubleshooting

### GitHub Actions workflow fails
→ Check logs in GitHub Actions tab, look for build or deployment errors

### App not accessible after deployment
→ Check Azure App Service logs:
```bash
az webapp log tail --name intralinked-app --resource-group intralinked-rg
```

### MongoDB connection error
→ Verify:
- `MONGODB_URI` is set in Azure Configuration
- MongoDB IP whitelist includes Azure
- Connection string format is correct

### Changes don't show up
→ Commit and push to `main` or `master` branch:
```bash
git push origin main
```

---

## Quick Reference URLs

| Resource | URL |
|----------|-----|
| Azure Portal | https://portal.azure.com |
| GitHub Actions | https://github.com/YOUR_USERNAME/YOUR_REPO/actions |
| Live App | https://intralinked-app.azurewebsites.net |
| App Configuration | https://portal.azure.com → Resource Groups → intralinked-rg → intralinked-app → Configuration |
| App Logs | https://portal.azure.com → Resource Groups → intralinked-rg → intralinked-app → Log stream |

---

## Files Created for Azure Deployment

| File | Purpose |
|------|---------|
| `.github/workflows/azure-deploy.yml` | GitHub Actions CI/CD pipeline |
| `web.config` | IIS configuration for Azure App Service |
| `Dockerfile` | Container image definition (for Container Apps) |
| `.dockerignore` | Files to exclude from Docker build |
| `AZURE_DEPLOYMENT.md` | Detailed deployment guide |
| `.env.example` | Template for environment variables |

---

## Next Steps After First Deployment

1. **Monitor Application**
   - Set up Application Insights for monitoring
   - Configure alerts for errors/high CPU

2. **Custom Domain** (Optional)
   - Add custom domain in App Service settings
   - Configure SSL certificate

3. **Performance Optimization**
   - Monitor response times
   - Scale up if needed (upgrade App Service Plan)

4. **Continuous Improvements**
   - Set up automated tests
   - Add pre-deployment checks
   - Implement database backups

---

✅ **You're ready to deploy!** Follow the steps above and your app will be live on Azure.
