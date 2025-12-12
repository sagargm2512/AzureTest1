# ⚡ QUICK START: Azure Deployment (5-30 minutes)

## 🚀 One-Command Deployment (Copy & Paste)

```bash
# 1. Login & Create Resources (5 mins)
az login
az group create --name intralinked-rg --location eastus
az appservice plan create --name intralinked-plan --resource-group intralinked-rg --sku B1 --is-linux
az webapp create --resource-group intralinked-rg --plan intralinked-plan --name intralinked-app --runtime "NODE|20-lts"

# 2. Set MongoDB Connection (1 min)
az webapp config appsettings set --name intralinked-app --resource-group intralinked-rg --settings MONGODB_URI="mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/EmployeeData" NODE_ENV="production" PORT="8080"

# 3. Get Publish Profile (1 min)
az webapp deployment list-publishing-profiles --name intralinked-app --resource-group intralinked-rg --query "[0]" > publish_profile.xml
cat publish_profile.xml  # Copy the output

# 4. Add to GitHub Secrets
# GitHub → Settings → Secrets and variables → Actions → New secret
# Name: AZURE_PUBLISH_PROFILE
# Value: Paste entire content from publish_profile.xml

# 5. Commit & Push (2 mins)
git add .
git commit -m "Add Azure deployment"
git push origin main

# 6. Watch Deployment (10 mins)
# GitHub → Actions → Watch workflow complete
# When done, visit: https://intralinked-app.azurewebsites.net
```

---

## ✅ 6-Step Checklist

- [ ] **Step 1** - Run Azure CLI commands (create resources)
- [ ] **Step 2** - Set MONGODB_URI environment variable
- [ ] **Step 3** - Copy publish profile
- [ ] **Step 4** - Add AZURE_PUBLISH_PROFILE to GitHub Secrets
- [ ] **Step 5** - Push to GitHub
- [ ] **Step 6** - Visit deployed app URL

---

## 📊 What Happens When You Push

```
git push origin main
           ↓
GitHub Actions starts
           ↓
├─ Install dependencies (npm ci)
├─ Build application (npm run build)
├─ Run tests (npm run test)
└─ Deploy to Azure (azure/webapps-deploy)
           ↓
5-10 minutes later...
           ↓
Your app is live! ✅
Visit: https://intralinked-app.azurewebsites.net
```

---

## 🔧 Configuration Summary

| What | Where | Value |
|-----|-------|-------|
| **App Name** | `.github/workflows/azure-deploy.yml` (line 5) | `intralinked-app` |
| **Node Version** | GitHub Actions | `20.x` |
| **Azure Region** | Resource Group | `eastus` |
| **Database** | Application Settings | `MONGODB_URI` env var |

---

## 🎯 Files Already Created For You

```
✅ .github/workflows/azure-deploy.yml   → CI/CD Pipeline
✅ web.config                           → Azure Configuration
✅ Dockerfile                           → Container Image
✅ src/main.ts                          → Listens on Port 8080
✅ src/app.module.ts                    → Reads MONGODB_URI
```

**You just need to:** Create Azure resources + Add GitHub Secret + Push

---

## ❌ Common Mistakes to Avoid

❌ **Don't forget to:**
- Replace `MONGODB_URI` with your actual MongoDB connection string
- Copy the entire publish profile XML to GitHub Secret
- Update app name in workflow file if using different name
- Push to `main` or `master` branch (not other branches)

❌ **Don't:**
- Commit `.env` file (already in .gitignore)
- Forget to set environment variables in Azure
- Skip getting the publish profile

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| **GitHub Actions fails** | Check workflow logs for error messages |
| **App not accessible** | Verify `MONGODB_URI` is set in Azure Configuration |
| **MongoDB connection error** | Check connection string format + IP whitelist |
| **Port already in use** | Azure automatically uses port 8080 |

---

## 📞 Check Logs

```bash
# View Azure app logs in real-time
az webapp log tail --name intralinked-app --resource-group intralinked-rg

# View GitHub Actions logs
# GitHub → Your Repo → Actions → Click workflow
```

---

## 🎉 Success = You Can Visit Your Live App

```
https://intralinked-app.azurewebsites.net
```

If it loads → ✅ Deployment Successful!

---

## 📚 Detailed Guides Available

Need more details? Check these files:

1. **AZURE_SETUP_COMPLETE.md** - Step-by-step walkthrough
2. **AZURE_DEPLOYMENT_CHECKLIST.md** - Detailed checklist
3. **DEPLOYMENT_STATUS.md** - Full status report
4. **README.md** - General project info

---

## ⏱️ Time Breakdown

| Step | Time |
|------|------|
| Create Azure Resources | 5 min |
| Set Environment Variables | 1 min |
| Get Publish Profile | 1 min |
| Add GitHub Secret | 2 min |
| Push Code | 2 min |
| GitHub Actions Deployment | 5-10 min |
| Verify App | 1 min |
| **Total** | **~30 minutes** |

---

## 🚀 Ready? Let's Go!

1. **Copy the one-command deployment script above**
2. **Replace YOUR_USER, YOUR_PASSWORD, YOUR_CLUSTER with real values**
3. **Run in terminal**
4. **Add secret to GitHub**
5. **Push to main**
6. **Wait 10 minutes**
7. **Visit your app URL**

**Questions?** Check AZURE_SETUP_COMPLETE.md for detailed guide.
